# StudyBench Product Requirements Document

## 1. Product Summary

StudyBench is a digital learning platform designed to help people read, practice, ask questions, and build real understanding in one place.

The product combines a free educational library, an original Web3 learning library, and an AI-assisted practice workspace. The platform is intentionally structured as a multi-page product rather than a single-page dashboard so each part of the learning experience has its own clear space.

StudyBench is built around a simple principle:

**Learn. Practice. Understand.**

The long-term vision is to become a broad learning platform where academic subjects, technology, finance, Web3, and other useful topics can live together without making learning feel complicated.

---

## 2. Problem

Learning is often unnecessarily scattered.

A student or learner may need to move between textbooks, notes, websites, practice questions, AI tools, videos, and search engines just to understand one topic. This creates friction and makes it harder to stay focused.

Many AI learning products also make AI the entire product. That can encourage users to ask for answers without doing enough reading or practice themselves.

StudyBench solves this by combining structured learning resources, practice tools, and AI assistance while keeping AI as a study companion rather than a shortcut.

---

## 3. Target Users

### Primary users

- Students who want a simpler place to read and practice
- Independent learners studying mathematics, science, technology, finance, or Web3
- Beginners who need approachable explanations and structured learning resources
- Learners who want AI-assisted quizzes, flashcards, and worked explanations

### Secondary users

- People entering Web3 who need beginner-friendly learning material
- Self-taught learners who do not have access to a formal classroom structure
- Users who want free access to openly licensed textbooks in one focused library

---

## 4. Core User Job

The main job of StudyBench is:

> Help a learner move from finding something worth learning, to studying it, practicing it, and getting help when they are stuck.

A successful session should allow the user to do one or more of the following without leaving the platform unnecessarily:

1. Find a topic or book
2. Read the learning material
3. Test their understanding
4. Ask for help
5. Continue learning in another section

---

## 5. Product Principles

### 5.1 AI is a companion, not the whole product

StudyBench should still be useful even if the AI feature is temporarily unavailable.

The educational library and Web3 library must stand on their own.

### 5.2 Learning should feel organized

Each major product area has its own route and purpose.

### 5.3 Reading should remain accessible

The free educational and Web3 libraries should not be placed behind the Ask AI paywall.

### 5.4 Practice matters

The product should encourage users to test themselves instead of only reading answers.

### 5.5 Keep the interface focused

The homepage should introduce StudyBench and direct users to the correct area. It should not attempt to display the entire product at once.

---

## 6. V1 Scope

StudyBench V1 contains the minimum complete platform needed to prove the core product idea.

### 6.1 Public routes

- `/` - Homepage
- `/educational` - Educational library
- `/web3` - Web3 library
- `/ask-ai` - AI-assisted practice tools
- `/about` - Product story and philosophy
- `/book/[id]` - Reading page
- `/login` - Authentication
- `/signup` - Account creation

### 6.2 Admin routes

- `/admin` - Admin dashboard and book management
- `/admin/textbooks` - Educational textbook hosting manager

Admin tools are accessible only to authorized administrators.

---

## 7. V1 Features

### 7.1 Homepage

The homepage is a concise landing page that introduces StudyBench and directs users to:

- Educational
- Web3
- Ask AI
- About

The homepage communicates the main product message:

**Learn it. Practice it. Understand it.**

It should not display the full library or behave like a single giant application screen.

### 7.2 Educational Library

The Educational section provides a focused shelf of academic resources.

Current categories include:

- Mathematics
- Physics
- Biology
- Chemistry
- History
- Government

The V1 catalogue includes openly licensed textbooks and paid catalogue listings.

Free/open titles can be read through StudyBench.

Paid/proprietary books are not hosted. They remain informational catalogue entries that take the user to an Amazon listing.

### 7.3 Hosted Open Textbooks

StudyBench hosts approved openly licensed educational textbooks.

For smaller textbooks, the PDF is stored as a normal hosted file.

For larger high-resolution textbooks that exceed the storage provider's per-file limit, StudyBench stores the original PDF as multiple lossless binary chunks. The reader reconstructs the original PDF in the user's browser.

This preserves the original file quality without lowering image resolution.

Attribution and source information remain visible for licensed educational material.

### 7.4 Web3 Library

The Web3 wing contains original StudyBench learning content.

Topics include areas such as:

- Blockchain fundamentals
- Cryptocurrency
- Wallets and security
- DAOs
- Governance
- DeFi
- Lending and borrowing
- Automated market makers
- Yield farming
- NFTs
- Smart contracts
- NFT markets
- Crypto tax and compliance
- Launch and marketing topics

Each source topic remains its own learning document rather than being merged into unrelated summaries.

### 7.5 Book Reader

The reading page supports:

- Original Web3 text content
- Hosted educational PDFs
- Reconstructed high-resolution chunked PDFs
- Source and license attribution
- Paid book catalogue information
- Amazon redirection for proprietary paid titles

### 7.6 Ask AI

Ask AI is a separate product area rather than the default homepage experience.

V1 modes include:

- Quiz Me
- Flashcards
- Solve With Me

Supported subject areas include academic subjects and Web3 topics.

The AI is intended to help users practice and understand material rather than replace the learning process.

### 7.7 Free Usage and Paid Unlock

Authenticated users receive:

- 25 free successful AI generations per rolling 24-hour window

Users can unlock unlimited AI access for 365 days through a one-time Paystack payment of:

- ₦1000

Reading the Educational and Web3 libraries remains free.

### 7.8 Authentication

V1 supports:

- Email/password signup
- Login
- Email confirmation flow
- Persistent Supabase sessions while navigating the site
- Cloudflare Turnstile protection on authentication flows

### 7.9 Admin System

Authorized administrators can:

- View basic platform statistics
- Create books
- Edit books
- Publish or unpublish books
- Delete books
- Preview published content
- Mirror approved educational PDFs into StudyBench storage

Admin authorization is controlled by the user's database profile role.

### 7.10 Payments

Paystack is used for the one-time unlimited AI unlock.

The server verifies:

- Successful transaction status
- Expected amount
- NGN currency
- Logged-in user identity
- Payment reference uniqueness

Successful payment creates the 365-day unlimited access period.

---

## 8. Technical Stack

### Frontend

- Next.js 14 App Router
- React

The frontend handles page routing, navigation, learning interfaces, authentication UI, the textbook reader, Ask AI tools, and admin interfaces.

### Backend

- Next.js API routes

The backend handles protected actions such as AI generation, payment verification, admin operations, usage enforcement, and textbook mirroring.

### Database and Authentication

- Supabase PostgreSQL
- Supabase Auth

Supabase stores user profiles, books, usage records, payment records, admin status, and textbook metadata.

### File Storage

- Supabase Storage

Used for StudyBench-hosted educational textbook files and lossless textbook chunks.

### AI

- Anthropic API

Used for quizzes, flashcards, worked explanations, and related AI-assisted learning functions.

### Bot Protection

- Cloudflare Turnstile

Used to protect authentication flows from automated abuse.

### Payments

- Paystack

Used for the one-time unlimited AI purchase.

### Version Control

- GitHub

The main StudyBench codebase is version controlled in GitHub.

### Hosting

- Vercel

Vercel hosts the Next.js application and server-side API routes.

---

## 9. V1 Constraints

V1 intentionally works within several constraints:

- The platform is web-first
- No native iOS or Android application
- Supabase Free storage has a per-file size limit
- AI usage has a cost, so free generations must be limited
- Open educational content must respect source licenses and attribution requirements
- Proprietary books must not be hosted without permission
- The product must remain useful without relying entirely on AI
- V1 should remain understandable and maintainable by a small team

---

## 10. V1 Success Condition

V1 is successful if a new user can:

1. Understand what StudyBench is from the homepage
2. Browse Educational or Web3 content
3. Open and read a learning resource
4. Create an account and remain logged in while navigating
5. Use Ask AI for practice
6. Understand the free generation limit
7. Unlock unlimited access through a verified payment
8. Move between the major product areas without confusion

From the product side, V1 should also allow an administrator to manage content and maintain the educational library without editing the database manually for routine operations.

---

# NOT NOW

The following features are intentionally outside V1.

They may be useful later, but including them now would increase complexity, cost, moderation needs, or product scope before the core StudyBench experience has been validated.

## Social and Community

- Student-to-student messaging
- Comments under books
- Public user profiles
- Social feeds
- Community forums
- Leaderboards

## Gamification

- XP systems
- Daily streaks
- Badges
- Achievement systems
- Competitive rankings

## Advanced Study Tools

- Full note-taking workspace
- Textbook annotations
- Highlighting
- Saved page bookmarks
- Offline reading
- Offline textbook downloads
- Long-term AI conversation memory
- Voice input
- AI voice responses
- Text-to-speech study mode
- Handwritten question scanning
- Camera-based problem solving
- Personalized tutor personalities
- Full AI-generated study plans

## Academic Institution Features

- Teacher dashboards
- School accounts
- Classroom management
- Assignment submission
- Exam administration
- Online proctoring
- Institutional analytics
- Certificates

## Marketplace and Publishing

- User-uploaded books
- Public creator publishing
- Paid course marketplace
- Creator revenue sharing
- User-generated public learning material

## Payments and Monetization

- Monthly subscriptions
- Multiple pricing tiers
- Crypto payments
- Institutional billing

## Platform Expansion

- Native iOS application
- Native Android application
- Full multilingual support
- Push notifications
- Large-scale recommendation engine
- Advanced moderation tooling

---

# V2 PLAN

V2 should deepen the current product rather than turn StudyBench into a completely different platform.

The central V2 goal is:

> Give StudyBench memory, progress, and personalization so users have a reason to return regularly.

## 1. Personal Study Dashboard

Create a user dashboard that shows:

- Continue reading
- Recently opened books
- Recent AI sessions
- Quiz activity
- Saved resources
- Study progress

## 2. Progress Tracking

Track useful learning activity such as:

- Books opened
- Pages or sections completed
- Web3 guides completed
- Quizzes taken
- Quiz scores
- Flashcards reviewed
- Recent learning activity

## 3. Bookmarks, Highlights, and Notes

Allow users to save useful parts of their study material.

Potential features:

- Bookmark pages
- Highlight passages where technically possible
- Add personal notes
- Return to saved reading positions

## 4. Saved AI Sessions

Users should be able to return to previous:

- Quizzes
- Flashcards
- Worked solutions
- Tutor conversations

## 5. Tutor Conversation Mode

Expand Ask AI from one-off generation into a guided tutoring experience.

The tutor should be able to:

- Ask the learner questions
- Give hints before answers
- Explain mistakes
- Adjust explanation difficulty
- Continue a topic across several messages

## 6. Image and Question Upload

Allow users to upload or photograph a question and ask StudyBench to explain it.

Useful for:

- Mathematics
- Physics
- Chemistry
- Diagrams
- Handwritten exercises

## 7. Study Plans

Allow a learner to provide a goal such as:

> I have an exam in three weeks.

StudyBench can then create a realistic learning plan using:

- Library resources
- Practice quizzes
- Flashcards
- Suggested revision sessions

## 8. Quiz History and Weak Topics

Track performance over time and help the user identify areas that need more practice.

The dashboard may show:

- Average score
- Recent quiz results
- Weak topics
- Improving topics
- Suggested next practice

## 9. Spaced-Repetition Flashcards

Turn flashcards from one-time generated content into a repeatable study system.

Users can review cards based on how well they remember them.

## 10. Unified Search

Create one StudyBench search experience that can discover:

- Educational books
- Web3 guides
- Topics
- Categories
- Potentially relevant Ask AI actions

## 11. Better Textbook Reader

Improve the reading experience with features such as:

- Remember last page
- Jump to page
- Table of contents where available
- Fullscreen reading
- Better zoom controls
- Improved mobile reading experience

## 12. User Preferences

Allow users to define preferences such as:

- Preferred subjects
- Learning goals
- Difficulty level
- Areas of interest

These preferences can later improve recommendations and AI output.

## 13. Expanded Learning Categories

Potential future StudyBench shelves include:

- Programming
- Technology
- Finance
- Economics
- Philosophy
- Additional sciences
- Career and professional learning topics

## 14. Structured Web3 Learning Paths

Turn the Web3 library into optional guided pathways.

Example beginner path:

1. Blockchain fundamentals
2. Cryptocurrency
3. Wallets and security
4. Smart contracts
5. DeFi
6. DAOs
7. NFTs
8. Compliance and risk

## 15. Admin V2

Improve administration with:

- Payment history
- User activity metrics
- Better content publishing workflow
- Search and filtering
- Content performance metrics
- Reader activity
- AI usage analytics

## 16. Email Study Reminders

Optional reminders for users who want them, including:

- Study-plan reminders
- Saved-session reminders
- Continue-reading reminders

## 17. Progressive Web App

Explore making StudyBench installable as a Progressive Web App before investing in separate native iOS and Android apps.

This could provide a more app-like mobile experience while keeping one main codebase.

---

# V3 AND LATER

Features that should generally wait until after V2 proves stronger retention and repeat usage include:

- Native mobile apps
- Full social/community system
- Teacher and classroom tools
- Institution accounts
- Certificates
- Paid course marketplace
- Creator publishing platform
- Large-scale user-generated content
- Public creator economy

---

## Product Direction After V1

V1 proves that StudyBench can combine content, practice, and AI in one focused learning product.

V2 should make the product remember the learner.

The intended progression is:

**V1:** Content + Practice + AI

**V2:** Memory + Progress + Personalization

**Later:** Community + Institutions + Marketplace

The product should expand only when each new layer makes learning more useful without making StudyBench unnecessarily complicated.
