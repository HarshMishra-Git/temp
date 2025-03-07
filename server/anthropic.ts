const content = response.content[0];
    if ('text' in content) {
      // Handle potential code block markers in the response
      let textContent = content.text.trim();
      console.log("Raw API response:", textContent);

      // Remove markdown code block syntax if present
      if (textContent.includes('```json')) {
        textContent = textContent.replace(/```json\s*/, '').replace(/\s*```\s*$/g, '');
      } else if (textContent.includes('```')) {
        textContent = textContent.replace(/```\w*\s*/, '').replace(/\s*```\s*$/g, '');
      }

      // Further cleanup to ensure valid JSON
      textContent = textContent.trim();

      // Parse the cleaned JSON
      try {
        console.log("Cleaned JSON for parsing:", textContent);
        return JSON.parse(textContent);
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        console.error('Response Text:', textContent);

        // Last resort - try to extract JSON content with regex
        try {
          const jsonMatch = textContent.match(/(\{[\s\S]*\})/);
          if (jsonMatch && jsonMatch[0]) {
            console.log("Attempting regex JSON extraction");
            return JSON.parse(jsonMatch[0]);
          }
        } catch (regexError) {
          console.error('Regex extraction failed:', regexError);
        }

        throw new Error('Failed to parse API response as JSON');
      }
    }