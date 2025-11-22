### Standup App
A simple web application to track daily team standups, submissions, and weekly participation statistics.

🚀 Setup Instructions

1. Clone the repository
git clone https://github.com/omarzahidli/standup-app.git
cd standup-app

3. Install dependencies
npm install

4. Start the local JSON server ( standups-mock-data.json )
npm install -g json-server (Install json-server if you don't have) 
json-server --watch mockData.js --port 3001
(P.S check http://localhost:3001 if it works or not)

5. Run the project
npm start


🔧 Technologies & Libraries Used for Core Features

React – Component-based frontend

Tailwind CSS – Fast responsive styling

RTK Query – Efficient API fetching and caching

Formik + Yup – Form state management and validation

Day.js – Timezone handling (Baku UTC+4) and date formatting

React-Toastify – Success/error notifications

Local JSON server (mockData.js) – Mock backend for development

✨ Features Implemented

1. Standup Submission Form

Allows team members to submit daily standups with three fields:

Yesterday: 10–500 characters, required

Today: 10–500 characters, required

Blockers: Optional, min 10 max 300 characters

Select user from a dropdown of team members

Auto-captures submission timestamp

Validates all inputs using Formik + Yup

Success and error feedback shown via React-Toastify notifications

Advanced logic implemented:

Prevents duplicate submissions for the same day

Draft auto-save to localStorage (restores after refresh)

2. Team Status Dashboard

Displays three sections:

Submitted: Members who submitted today (with timestamps)

Pending: Members who haven’t submitted yet

On Vacation: Members currently on vacation

Shows participation rate dynamically (e.g., "3 of 8 members – 37.5%")

Advanced features:

Auto-refresh every 30 seconds without page reload

Color-coded timestamps (green: before 10 AM, yellow: 10–11 AM, red: after 11 AM)

Streak badges for consecutive daily submissions

Timestamps converted to Baku timezone with Day.js

3. Vacation Registration

Form fields: user, start date, end date, reason (optional)

Displays all active vacations

Advanced logic implemented:

Prevents overlapping vacation dates for the same user

Warns if more than 30% of team is on vacation

Validates end date is after start date

Excludes vacationing members from pending submissions

Success and error notifications via React-Toastify

4. Standup History & Analytics

Allows viewing all past standups and analyzing team performance

Displays: Date, Team Member, Yesterday, Today, Blockers

Filters implemented:

Specific user

Date range

Has blockers (yes/no)

Sort options:

By date

By user

By submission time

Advanced features:

Pagination (10 items per page)

Efficient handling of 500+ standup records

Highlights standups containing blocker keywords (with red border)

Search:

Users can search any string in standups (works in parallel with filters)


🔮 Future Improvements

Dynamic Dashboard: Currently the dashboard is static due to static mock data. In the future, connect to a live backend to make submissions and statuses update in real time.

User Authentication: Implement login so each user can submit only for themselves.

Admin Features: Add editing and deleting capabilities for admins to manage standups and vacations.

Vacation Status Editing: Allow updating vacation statuses for flexibility in team management.

Analytics Charts: Integrate Chart.js to visualize weekly submissions, participation rates, and streaks for better team insights.

UI/UX Improvements: Improve responsiveness on small screens and add more visual cues (badges, charts, toast animations).

⏱ Time Spent

Approximately 10-12 hours

🌐 Live Demo (but you need to run json-server to see data)
https://omarzahidli.github.io/standup-app/

