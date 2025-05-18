## Use Case Diagram 
START
  │
  ▼
  ├──> View Portfolio
  │     └── Portfolio Page
  │           ├── View KPIs for overall stock performance
  │           ├── View User's Invested Stocks
  │           └── View Stocks by Category
  │                └── View stock table for detailed information on each stock
  │
  ├──> Click on User Profile
  │     └── View User Details Page
  │
  └──> Click the Refresh Button
        └── Fetch the latest stock updates

 
## Implementation
Framework: Next.js
Styling: Tailwind CSS

- **Recharts** – For data visualization and charts  
- **Material UI** – For dialogs and UI components  
- **React Spinners** – For loading animations  
- **Yahoo Finance API** – For real-time stock data  
- **Deployment** –  Vercel
- - **Development Methodology** – DevOps practices


## Real-Time Data Flow from Yahoo Finance
The diagram below illustrates how real-time stock data is retrieved from the Yahoo Finance API:


## Main Challenges Faced During the Project

Deployment was one of the most challenging parts of the project.Everything worked perfectly on localhost, but during deployment on Vercel, the application threw errors and failed to build properly, even though the codebase was correct.
Here is an example of one such error:

![image](https://github.com/user-attachments/assets/87153431-1063-4e60-bff3-2a78c018a506)

1. Fetching Data from Yahoo Finance
Initially, fetching data from Yahoo Finance resulted in multiple errors. After optimizing the code and restructuring file and naming conventions, the issues were resolved and data retrieval was successful.

3. Data Passing Between Frontend and Backend
Once the backend was completed, passing the data to the frontend became confusing and a bit frustrating. I took inspiration from Claude AI and other resources to better understand the correct flow, which helped get things back on track.

4. Deployment Issues
Deployment was the most challenging part. Although everything worked perfectly on localhost, deploying to Vercel resulted in unexpected errors. After careful debugging, I discovered the issue:
The project initially used the pages directory structure.
In the new version, I transitioned to the app directory.
During Vercel deployment, selecting the correct root (app) was critical.
I restarted the project from the Recharts integration point, using the same logic but with cleaner structure. Eventually, the deployment succeeded. This process was frustrating but incredibly educational and rewarding.






