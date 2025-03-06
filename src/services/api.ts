import axios from "axios";
import { QuizTemplate } from "../types/quiz.interface";

// Data from S3 Bucket
const API_URL =
  "https://leanarys-bucket.s3.us-east-1.amazonaws.com/mock-data/error-find-payload.json";

/**
 * Fetches the quiz template from the API.
 * @async
 * @throws {Error} If the API request fails or returns invalid data.
 * @returns {Promise<QuizTemplate>} The fetched quiz template.
 */
export const fetchQuizTemplate = async (): Promise<QuizTemplate> => {
  try {
    const response = await axios.get(API_URL);
    // Check for non-200 responses
    if (response.status !== 200) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    // Ensure the response contains valid quiz data
    if (!response.data || !response.data.activities) {
      throw new Error("Invalid quiz data received from API.");
    }

    return response.data; // Valid response
  } catch (error) {
    console.error("Error fetching the quiz template:", error);
    throw new Error((error as Error).message || "An unknown error occurred.");
  }
};