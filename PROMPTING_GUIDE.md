# A Developer's Guide to Building with Copilot Agent

This document captures the effective, collaborative patterns I adopted while building the GHAS Vulnerability Insight dashboard app with the Copilot agent. It serves as a playbook for other developers looking to partner with the agent to build applications efficiently.

## My Core Philosophy: Architect and Agent Partnership

My collaboration with GitHub Copilot agent was a partnership between an experienced java developer (me) and a highly capable engineer (the agent). I provided the strategic vision and technical oversight, defining *what* needed to be built and ensuring the proposed solutions met our architectural standards. GitHub Copilot was responsible for the high-velocity implementation, translating my goals into code.

Our success came from a refined, iterative feedback loop: `High-Level Goal -> Agent's Proposed Plan -> My Architectural Review -> Implementation -> Continuous Testing & Refinement`.

## My Development Workflow: A Retrospective

I built this application by guiding GitHub Copilot through one major feature at a time. I described the desired functionality, and the agent proposed a detailed implementation plan, which I would then vet and approve before it proceeded.

### Phase 1: From Vision to Vetted Scaffold
I started with the core concept, and GitHub Copilot proposed the initial project structure, which I then validated.

- **My Prompt (The Vision):** "I want to build a web app that visualizes GitHub security data. Let's use a Java backend and a React frontend."
- **Copilot's Proposed Plan:** "Great idea. For the backend, I suggest Spring Boot for its robustness. For the frontend, React with TypeScript is a solid choice for type safety. Does that sound good?"
- **My Review and Approval:** "The stack is good. For the Spring Boot backend, ensure you include dependencies for Spring Web, Spring Data JPA, and use SQLite for simple file-based persistence. Proceed."
- **Copilot's Action:** Upon my approval, GitHub Copilot ran the necessary commands to create the project structure with the specified dependencies.

### Phase 2: Guided Feature Implementation
This is where our workflow truly shined. I described a feature in plain English, and the agent returned a full-stack plan for my review.

- **My Prompt (The Feature Goal):** "Let's add the ability to create 'business applications' and link GitHub repositories to them. This needs to be persisted and managed via an API."

- **Copilot's Proposed Plan:**
    1.  **Analyzed the request:** "Okay, to implement this, I'll need to:
        -   Use the existing SQLite database.
        -   Create JPA entities for 'BusinessApplication' and its repository mappings.
        -   Build a REST API with full CRUD endpoints.
        -   Create a new frontend page with a form for creating/editing and a table for listing applications.
        -   Connect the frontend to the new backend API.
        Shall I proceed?"
- **My Review and Refinement:** "The plan is solid. On the backend, ensure the service layer methods are transactional. For the frontend, use our existing Material-UI component library for the form and table to maintain a consistent look and feel. Go ahead."
- **Copilot's Action:** With my refined instructions, GitHub Copilot executed the plan, creating the necessary backend entities, services, and controllers, and the corresponding frontend pages and API service calls.

### Phase 3: The Critical Role of Continuous Testing
A core tenet of our process was to test immediately after each implementation. The agent's speed is a massive advantage, but it necessitates immediate validation by the experienced developer.

- **My Role as Tester:** After GitHub Copilot created the business applications feature, my immediate next step was not to move on, but to run the application. I started both the backend and frontend servers and performed a manual test of the entire user flow:
    1.  Navigated to the new "Business Applications" page.
    2.  Filled out the form to create a new application.
    3.  Submitted the form and checked for UI updates.
    4.  Verified the data was correctly persisted by refreshing the page and checking the backend logs.
- **This immediate feedback loop is non-negotiable.** It allowed me to catch subtle bugs in state management or API integration right away, rather than discovering them later. My experience allowed me to anticipate edge cases and test for them specifically.

### Phase 4: Collaborative Debugging
When tests revealed issues, I provided targeted feedback based on my experience.

- **My Prompt (The Problem):** "I've tested the new feature. When creating a business application, the API call succeeds, but the new application doesn't appear in the list until I manually refresh the page. This points to a state management issue in the React component. Please fix `BusinessApplications.tsx` to automatically refresh the list after a successful creation."
- **Copilot's Action:** Armed with a precise problem description, GitHub Copilot read the `BusinessApplications.tsx` file, identified the missing logic to refetch the data or update the local state, and applied the fix.

### Phase 5: Course-Correction and Knowledge Sharing
It's important to remember that the agent's knowledge, while vast, is not infallible. There were instances where its initial implementation was incorrect, and your domain expertise is crucial for course correction. This highlights the true partnership aspect of the workflow.

- **Scenario:** We needed to implement a feature to fetch enterprise-wide vulnerability data.
- **Copilot's Initial Mistake:** The agent's first pass at the implementation used an API endpoint that fetched alerts on a per-repository basis and tried to aggregate them. While a logical first step, my testing revealed this was incredibly slow and often missed data from repositories I didn't have explicit access to. The implementation logic was flawed for a true enterprise view.
- **My Role as the Expert:** My experience with the GitHub API made me suspect the agent was using the wrong endpoint. I knew there were specific enterprise-level REST APIs designed for this exact purpose.
- **My Corrective Prompt:** "The enterprise data extraction is not correct; it's too slow and the data seems incomplete. I believe you're iterating through repositories. The correct approach is to use the dedicated enterprise-level endpoints. Please consult the official GitHub REST API documentation for enterprise administrators, specifically for endpoints like `/enterprises/{enterprise}/code-scanning/alerts`. Refactor the `GitHubApiService` to use these direct enterprise APIs."
- **Copilot's Corrective Action:** Acknowledging the guidance, the agent reviewed the suggested part of the documentation, confirmed the correct approach, and refactored the service class. It replaced the inefficient iteration with direct calls to the proper enterprise-level endpoints, which was both more accurate and significantly more performant.

### Phase 6: Evolving the App with "Living" Documentation
As the application grew, we kept the documentation in sync with the code.

- **My Prompt (The Update):** "The app's flow has changed significantly. Update our diagrams to reflect the new business application feature and its API."
- **Copilot's Action:** Read `SEQUENCE_DIAGRAM.md` and `ARCHITECTURE.md`, analyzed the new controllers and components that had been created, and updated the Mermaid syntax in both files to accurately represent the current state of the application.

## Key Patterns for Success in Agent-Driven Development
Our collaboration revealed several key patterns that are crucial for success:

- **Direct with Intent:** Focus your prompts on the desired outcome, not just the intermediate steps. Instead of "create a file," say "create a component that does X."
- **Provide Rich Context for Errors:** When debugging, always provide the full error message and stack trace. This allows the agent to pinpoint the problem's source quickly.
- **Review and Refine:** Treat the agent's output as a first draft. As an experienced developer, your role is to critically review the proposed code and architecture. Provide corrective feedback to steer the agent toward a robust and maintainable solution.
- **Test Relentlessly:** The agent writes code, but you own the quality. Make testing a continuous part of the development loop, not an afterthought.
- **Use the Agent for the Full Lifecycle:** Leverage the agent for everything from boilerplate creation to coding, debugging, and documentation. This maximizes efficiency and keeps the entire project consistent.

## Agent Mode vs. Normal Chat: A Shift in Prompting

The "agent" mode you've been using is fundamentally different from a standard chat interaction. Understanding this difference is key to maximizing your productivity. In short, you shift from asking for *information* to directing *action*.

| Aspect | Normal Chat Interaction | Agent Mode Interaction |
| :--- | :--- | :--- |
| **Primary Goal** | To get information, code snippets, or explanations. | To accomplish a task and modify your project's files. |
| **Your Role** | You are a developer. You receive text and decide how to use it. | You are a director or a manager. You issue commands and goals. |
| **AI's Role** | The AI is a knowledgeable assistant that provides text-based answers. | The AI is an active participant in your project with tools to act on its own. |
| **Workspace Access** | **None.** The AI knows nothing about your project unless you paste code into the chat. | **Full.** The AI can read, write, and create files, and run commands in the terminal. |
| **Prompt Style** | **"Show me how" or "Explain this."** You ask for instructions that you will then carry out yourself. | **"Do this" or "Implement that."** You describe the desired end state, and the agent takes the steps to get there. |
| **Example Prompt** | "How do I add a new page in React Router?" | "Create a new page component `Analytics.tsx` and add it to the main router in `App.tsx` with the path `/analytics`." |
| **Error Handling** | "I have this error: [paste error]. What could be wrong?" | "I'm getting an error when running `npm start`. Here is the output: [paste output]. Please fix the issue." |

### Key Takeaway: From "What?" to "Do."

- In **chat mode**, you are responsible for the "doing." You ask "What is the code for X?" and then you copy, paste, and adapt it into your project.
- In **agent mode**, the AI is responsible for the "doing." You say, "Implement feature Y," and the agent reads the relevant files, writes the new code, and can even run tests to verify it.

Your prompting style evolves from asking for recipes to ordering a meal. You focus more on the high-level goal ("Add a heatmap to the business applications page") and less on the low-level implementation details, trusting the agent to handle them. You then review the changes, provide feedback, and steer the agent toward the final, desired outcome.
