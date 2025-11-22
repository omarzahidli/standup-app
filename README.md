Standup App 📝

A simple web application to track daily team standups, submissions, and weekly participation statistics.

🚀 Setup Instructions

Clone the repository

git clone https://github.com/omarzahidli/standup-app.git
cd standup-app


Install dependencies

npm install


Start the local JSON server (standups-mock-data.json)
(Install json-server globally if you don’t have it)

npm install -g json-server
json-server --watch mockData.js --port 3001


P.S. Check http://localhost:3001
 to ensure it works.

Run the project

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

Submit daily standups with three fields:

Yesterday: 10–500 characters, required

Today: 10–500 characters, required

Blockers: Optional, 10–300 characters

Select user from a dropdown

Auto-captures submission timestamp

Validates inputs using Formik + Yup

Success/error feedback via React-Toastify

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

Success/error notifications via React-Toastify

4. Standup History & Analytics

View all past standups and analyze team performance

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

Search: works in parallel with filters, can search any string

🔮 Future Improvements

Dynamic Dashboard: Make submissions and statuses update in real time

User Authentication: Each user can submit only for themselves

Admin Features: Editing and deleting standups/vacations

Vacation Status Editing: Update vacation statuses easily

Analytics Charts: Integrate Chart.js to visualize weekly submissions, participation rates, and streaks

UI/UX Improvements: Improve responsiveness, add badges, charts, and toast animations

⏱ Time Spent

Approximately 10–12 hours

🌐 Live Demo

(Requires running JSON server to see data)
https://omarzahidli.github.io/standup-app/
