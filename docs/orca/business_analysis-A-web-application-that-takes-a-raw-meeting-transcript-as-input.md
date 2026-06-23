# business_analysis: A web application that takes a raw meeting transcript as input and uses a language model to extract actionable meeting n

Status: draft

## outOfScope

- User authentication and accounts.
- Saving history or transcripts.
- Integration with project management tools (e.g., Jira, Asana).
- Advanced formatting like highlighting or rich text editor for input.
- Mobile-specific responsive design (though basic responsive layout is assumed).
- Analytics or tracking.

## assumptions

- The language model is capable of understanding messy transcripts and extracting structured information.
- The user has access to a language model service (either self-hosted or via API).
- No user authentication or persistent storage is needed for the MVP.
- The tool will be deployed as a simple web service (e.g., using Docker).

## userStories

- As a meeting participant, I want to paste a messy transcript into the tool and immediately see a clean summary of discussion points, so I can quickly review what was decided.
- As a project manager, I want to see clearly identified action items with responsible parties if mentioned, so I can assign tasks.
- As a busy professional, I want the tool to highlight deadlines mentioned in the transcript, so I never miss a due date.

## scopeAnswers

- What is the expected maximum length of transcripts?
Answer: you can keep something around 500 words
- Should the tool extract responsible persons for action items if mentioned?
Answer: depends
- Is there a preferred language model (e.g., OpenAI, open-source) or should we support both?
Answer: OpenAI
- Should the tool provide an option to edit the output before copying?
Answer: yes
- How should the output be formatted (plain text, markdown, rich text)?
Answer: rich text
- Is there a need for the tool to handle multiple languages?
Answer: no

## scopeQuestions

- What is the expected maximum length of transcripts?
- Should the tool extract responsible persons for action items if mentioned?
- Is there a preferred language model (e.g., OpenAI, open-source) or should we support both?
- Should the tool provide an option to edit the output before copying?
- How should the output be formatted (plain text, markdown, rich text)?
- Is there a need for the tool to handle multiple languages?

## acceptanceCriteria

- The user can paste text into a text area.
- The system sends the transcript to a language model with a prompt to extract notes, action items, and deadlines.
- The output displays as bulleted lists under sections: Meeting Notes, Action Items, Deadlines.
- The output appears on the same page without navigation.
- The system handles transcripts of varying lengths (up to a reasonable limit).
