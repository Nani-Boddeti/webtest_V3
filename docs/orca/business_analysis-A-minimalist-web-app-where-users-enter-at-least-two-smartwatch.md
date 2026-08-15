# business_analysis: A minimalist web app where users enter at least two smartwatch names, the app searches the internet via SerpAPI, extract

Status: draft

## outOfScope

- User accounts, authentication, or saving comparison history
- Payment processing, affiliate links, or direct purchase buttons
- Automated price tracking, alerts, or scheduled re-searches
- Comparing products other than smartwatches
- Native mobile applications
- Advanced natural language extraction for arbitrary specs beyond the five selected attributes
- Analytics, monitoring, or error tracking integrations

## tlFeedback

- The artifact contains specific, domain-focused user stories and verifiable acceptance criteria with clear UI, API, data, and workflow outcomes.
- No unanswered BLOCKING USER DECISION questions, generic-only stories, or unresolved integration decisions are present.

## assumptions

- SerpAPI is the chosen internet search API provider and the user will supply the API key; the project secrets property name is SERPAPI_API_KEY.
- The five priority attributes are exactly: price, battery life, sleep tracking, durability, and subscription-free.
- 'Subscription free' means the watch does not require a mandatory paid subscription for its core advertised functions; optional premium add-ons do not make a watch subscription-required.
- Default attribute weights are equal (20% each) until the user adjusts them.
- Price is displayed exactly as retrieved from search results, without currency conversion or regional normalization for the MVP.
- The purpose input is optional free text that is used in the verdict reasoning and may optionally prefill weights; the app does not require preset purpose categories.
- The app supports comparing any number of watches with a minimum of two, with no hard upper limit for the MVP unless performance requires a practical cap.
- The app does not persist comparisons or user data between sessions unless explicitly added later.

## userStories

- As a user, I can enter two or more smartwatch names to compare.
- As a user, I can trigger an internet search for the entered watches to retrieve product details.
- As a user, I can view a minimalist comparison page showing the five priority attributes for each watch.
- As a user, I can adjust the importance weight for each of the five priority attributes before the verdict is calculated.
- As a user, I can optionally provide my purpose for the watch so the verdict can be tailored to that context.
- As a user, I can see a final verdict identifying the better value watch and a short explanation based on weighted scores.
- As a user, I can see clear error messages if search or data extraction fails for a watch.

## scopeQuestions


## tlReviewStatus

- Approved by Tech Lead

## tlChangeRequests


## visualReferences


## acceptanceCriteria

- The input form requires at least two watch names and shows validation feedback if fewer than two are provided.
- Each entered watch name is used to query SerpAPI to retrieve web results containing product specifications.
- The comparison view displays Price, Battery Life, Sleep Tracking, Durability, and Subscription-Free status for every entered watch.
- The UI is minimalist, clean, and responsive on desktop and mobile.
- Each of the five priority attributes has a user-adjustable weight control, and all weights are used in the final scoring.
- If the user provides a purpose, the verdict explanation references the purpose and how the weights or reasoning align with it.
- The final verdict clearly states which watch offers better value and includes at least one sentence of reasoning backed by the displayed attributes.
- If a watch's attribute data cannot be found, the app shows a clear warning for that watch and does not silently omit the comparison.
- The SerpAPI key is read from project secrets using the property name SERPAPI_API_KEY and is never hardcoded or exposed client-side.
