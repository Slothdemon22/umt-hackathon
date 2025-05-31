import OpenAI from "openai";
import { supabase } from "./db";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

interface ImageMatchResult {
  url: string;
  description: string;
  matchReason: string;
  confidence: string;
}

// Get found items from Supabase
async function getFoundItems(): Promise<Array<{ imageUrl: string; description: string; category: string; location: string }>> {
  const { data, error } = await supabase
    .from('itemTable')
    .select('imageUrl, description, category, location')
    .eq('status', 'found');

  if (error || !data) {
    console.error("❌ Error fetching found items:", error);
    return [];
  }

  return data;
}

// Match items based on description and category
async function findBestMatch(
  foundItems: Array<{ imageUrl: string; description: string; category: string; location: string }>,
  lostItemDescription: string
): Promise<ImageMatchResult | null> {
  try {
    const prompt = `
You are an AI assistant helping to match a lost item with found items in a lost and found system.

Lost Item Description: "${lostItemDescription}"

Found Items:
${foundItems.map((item, i) => `
Item ${i + 1}:
Category: ${item.category}
Location: ${item.location}
Description: ${item.description}
`).join('\n')}

Your task is to find the best matching item from the list of found items that matches the lost item description.

Consider these factors in order of importance:
1. Key features and characteristics matching between descriptions
2. Category relevance
3. Location proximity
4. Overall similarity in description

For confidence levels:
- "high" = Strong match in multiple key features and category
- "medium" = Good match in some features or category
- "low" = Few or no matching characteristics

First, analyze the lost item description to identify key features.
Then, compare these features with each found item.
Finally, provide your best match with detailed reasoning.

Respond ONLY with a JSON object like this:
{
  "url": "imageUrl_of_best_match",
  "description": "full_description_of_matched_item",
  "matchReason": "detailed_explanation_of_matching_features_and_why_this_is_the_best_match",
  "confidence": "high" | "medium" | "low"
}

Be generous with confidence levels if there are good matches. Only use "low" if there are truly no good matches.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3, // Lower temperature for more consistent matching
      max_tokens: 500,
    });

    const content = response.choices[0].message.content;
    if (!content) return null;

    try {
      const result = JSON.parse(content) as ImageMatchResult;
      
      // Find the matching item and get its image URL
      if (result.confidence !== "low") {
        console.log("Found a match with confidence:", result.confidence);
        const matchedItem = foundItems.find(item => {
          const itemDesc = item.description.toLowerCase();
          const resultDesc = result.description.toLowerCase();
          
          // Check for substantial overlap in descriptions
          const isMatch = itemDesc.includes(resultDesc) || 
                 resultDesc.includes(itemDesc) ||
                 // Check if multiple words from one description appear in the other
                 itemDesc.split(' ').filter(word => word.length > 3)
                   .some(word => resultDesc.includes(word));
          
          if (isMatch) {
            console.log("Matched item found:", item);
            console.log("Image URL:", item.imageUrl);
          }
          return isMatch;
        });

        if (matchedItem) {
          console.log("Setting match result URL to:", matchedItem.imageUrl);
          // Ensure the URL is properly formatted
          const url = matchedItem.imageUrl.startsWith('http') 
            ? matchedItem.imageUrl 
            : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/umt-bucket${matchedItem.imageUrl}`;
          result.url = url;
          console.log("Final formatted URL:", url);
          // If we found a good match but confidence was medium, consider upgrading it
          if (result.confidence === "medium" && 
              (matchedItem.description.toLowerCase().includes(lostItemDescription.toLowerCase()) ||
               lostItemDescription.toLowerCase().includes(matchedItem.description.toLowerCase()))) {
            result.confidence = "high";
          }
        }
      }
      
      return result;
    } catch (error) {
      console.error("Error parsing OpenAI response:", error);
      return null;
    }
  } catch (error) {
    console.error("Error in findBestMatch:", error);
    return null;
  }
}

// Main function to match items
export async function findBestImageMatch(userDescription: string): Promise<ImageMatchResult | null> {
  try {
    console.log("Starting search with description:", userDescription);
    const foundItems = await getFoundItems();

    if (foundItems.length === 0) {
      console.warn("⚠️ No found items available to match against.");
      return {
        url: "",
        description: "No items found",
        matchReason: "There are currently no found items in the system to match against.",
        confidence: "low"
      };
    }

    console.log(`🔍 Analyzing ${foundItems.length} found items for matches...`);
    const result = await findBestMatch(foundItems, userDescription);
    console.log("Match result:", result);
    return result;
  } catch (err) {
    console.error("❌ Error finding match:", err);
    return null;
  }
} 