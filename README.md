# Error Find - Quiz Application

## Overview

A simple quiz application developed with React + TypeScript + Vite. 
It challenges users to identify the correct answers in various activities. 
After completing the quiz, users receive their final results based on their performance. 
Additionally, they can view the answer keys by selecting a question in the results.

## Live Demo
[Click here](d34u2pecmygptz.cloudfront.net/)

## Features

- Interactive quiz experience
- Two distinct activities
- Comprehensive result summary

## Tech Stack

- React (with TypeScript)
- Vite 
- HTML
- CSS 
- AWS S3 & CloudFront (for hosting)
- React Router
  
## Installation

To run the application locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/leanarys/react-task.git
   ```
2. Navigate to the project directory:
   ```bash
   cd react-task
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Development Server

To start the development server, run:
   ```bash
   npm run dev
   ```
Then, open your browser and go to http://localhost:5173/.

## Project Structure
### UI and Logic
```
/src
 ├── components/                
 │   ├── Button/   
 │   │   ├── Button.module.css   
 │   │   ├── Button.tsx   
 │   ├── DisplayCard/  
 │   │   ├── DisplayCard.module.css   
 │   │   ├── DisplayCard.tsx  
 │   ├── ErrorMessage/  
 │   │   ├── ErrorMessage.module.css   
 │   │   ├── ErrorMessage.tsx
 │   ├── Loader/  
 │   │   ├── Loader.module.css   
 │   │   ├── Loader.tsx    
 ├── pages/           
 │   ├── Activity/     
 │   │   ├── Activity.module.css    
 │   │   ├── Activity.tsx     
 │   ├── Home/    
 │   │   ├── Home.module.css 
 │   │   ├── Home.tsx 
 │   ├── NotFound/    
 │   │   ├── NotFound.module.css 
 │   │   ├── NotFound.tsx 
 │   ├── Score/    
 │   │   ├── Score.module.css 
 │   │   ├── Score.tsx 
 ├── hooks/           
 │   ├── useActivityContext.ts 
 ├── helpers/           
 │   ├── helpers.ts   

```

### State, Services & Core Setup
```
 ├── context/         
 │   ├── ActivityContext.tsx 
 │   ├── ActivityProvider.tsx 
 ├── services/        
 │   ├── api.ts       
 ├── types/           
 │   ├── quiz.types.ts   
 ├── App.tsx          
 ├── index.tsx        

```

## API
**Get Quiz Data**: GET /mock-data/error-find-payload.json

## Deployment
Deploying on AWS S3 & CloudFront:

1. Run `npm run build` to generate the production build, which will be stored in the `dist/` directory.
2. Upload the contents of the dist/ folder to your S3 bucket.
3. Configure CloudFront to serve content from the S3 bucket.

## Usage
1. Start the quiz by choosing an activity.
2. Select the answers for the given questions.
3. Receive instant feedback after answering all questions.
4. Review your final results at the end of the quiz.
5. View the answer keys by selecting a question in the results.

## Contact

For any inquiries, reach out via mary.leana.n.reyes@gmail.com

