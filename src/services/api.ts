import axios from "axios";
import { QuizTemplate } from "../types/quiz-interface";

const API_URL =
  "https://leanarys-bucket.s3.us-east-1.amazonaws.com/mock-data/error-find-payload.json";

export const fetchQuizTemplate = async (): Promise<QuizTemplate> => {
  try {
    const response = await axios.get(API_URL);
    console.log("response.data", response.data);
    return response.data;
    // const data = [
    //   {
    //     activity_name: "Activity One",
    //     order: 1,
    //     questions: [
    //       {
    //         is_correct: false,
    //         stimulus: "I really enjoy *to play football* with friends.",
    //         order: 1,
    //         user_answers: [],
    //         feedback: "I really enjoy *playing football* with friends.",
    //       },
    //       {
    //         is_correct: true,
    //         stimulus:
    //           "I think that *starting* a school science magazine is an excellent idea!",
    //         order: 2,
    //         user_answers: [],
    //         feedback:
    //           "I think that *starting* a school science magazine is an excellent idea!",
    //       },
    //       {
    //         is_correct: false,
    //         stimulus:
    //           "Watching films at home is *more cheaper* than at the cinema.",
    //         order: 3,
    //         user_answers: [],
    //         feedback: "Watching films at home is *cheaper* than at the cinema.",
    //       },
    //       {
    //         is_correct: false,
    //         stimulus:
    //           "On the one hand, small cameras are comfortable. *In the other hand*, larger ones take better photos.",
    //         order: 4,
    //         user_answers: [],
    //         feedback:
    //           "On the one hand, small cameras are comfortable. *On the other hand*, larger ones take better photos.",
    //       },
    //       {
    //         is_correct: false,
    //         stimulus: "My friend *like listening* to songs in English",
    //         order: 5,
    //         user_answers: [],
    //         feedback: "My friend *likes listening* to songs in English",
    //       },
    //     ],
    //   },
    //   {
    //     activity_name: "Activity Two",
    //     order: 2,
    //     questions: [
    //       {
    //         round_title: "Round 1",
    //         order: 1,
    //         questions: [
    //           {
    //             is_correct: false,
    //             stimulus:
    //               "Watching films at home is *more cheaper* than at the cinema.",
    //             order: 1,
    //             user_answers: [],
    //             feedback:
    //               "Watching films at home is *cheaper* than at the cinema.",
    //           },
    //           {
    //             is_correct: false,
    //             stimulus:
    //               "On the one hand, small cameras are comfortable. *In the other hand*, larger ones take better photos.",
    //             order: 2,
    //             user_answers: [],
    //             feedback:
    //               "On the one hand, small cameras are comfortable. *On the other hand*, larger ones take better photos.",
    //           },
    //         ],
    //       },
    //       {
    //         round_title: "Round 2",
    //         order: 2,
    //         questions: [
    //           {
    //             is_correct: true,
    //             stimulus:
    //               "I can't go out because I *haven't finished* my homework yet.",
    //             order: 1,
    //             user_answers: [],
    //             feedback:
    //               "I can't go out because I *haven't finished* my homework yet.",
    //           },
    //           {
    //             is_correct: false,
    //             stimulus: "My friend *like listening* to songs in English",
    //             order: 2,
    //             user_answers: [],
    //             feedback: "My friend *likes listening* to songs in English",
    //           },
    //         ],
    //       },
    //     ],
    //   },
    //   {
    //     activity_name: "Activity Three",
    //     order: 3,
    //   },
    //   {
    //     activity_name: "Activity Four",
    //     order: 4,
    //   },
    //   {
    //     activity_name: "Activity Five",
    //     order: 5,
    //   },
    //   // {
    //   //   activity_name: "Activity Six",
    //   //   order: 6,
    //   // },
    //   // {
    //   //   activity_name: "Activity Seven",
    //   //   order: 7,
    //   // },
    //   // {
    //   //   activity_name: "Activity Eight",
    //   //   order: 8,
    //   // },
    //   // {
    //   //   activity_name: "Activity Nine",
    //   //   order: 9,
    //   // },
    // ];
    // return data;
  } catch (error) {
    console.error("Error fetching the quiz template:", error);
    throw error;
  }
};
