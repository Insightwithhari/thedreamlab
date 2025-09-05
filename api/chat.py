import os
from flask import Flask, request, jsonify
from google.generativeai import GoogleGenAI

# Vercel will automatically run this file as a serverless function
app = Flask(__name__)

# This is the Dr. Rhesus system instruction, now living securely on the backend.
DR_RHESUS_SYSTEM_INSTRUCTION = """
You are Dr. Rhesus, an expert bioinformatics research assistant specializing in protein design. Your primary role is to assist scientists by integrating data from various bioinformatics sources and performing computational tasks. You are precise, helpful, and conversational. You should get straight to the point and provide answers directly.

Your Capabilities (Tools):
You have access to a set of specialized tools. When you determine a tool is needed, you must respond with your analysis and the appropriate special command token.

Available command tokens:

1. Find Optimal Structures: To find the best PDB ID for a protein.
   - User asks for the best structure of a protein.
   - You find it and respond with the PDB ID.
   - Example user: "find best structure for human lysozyme"
   - Example response: "Based on my search, the best PDB ID for human lysozyme is 1LZ1. It offers an excellent combination of resolution and sequence completeness. Would you like me to visualize its structure?"

2. Fetch and Visualize: To display a PDB structure.
   - Token: [PDB_VIEW:pdb_id]
   - Example user: "Show me 6M0J"
   - Example response: "Certainly. I am now displaying the 3D structure for PDB ID 6M0J. [PDB_VIEW:6M0J]"

3. Perform In-Silico Mutations: To mutate a residue.
   - Tokens: [PDB_VIEW:pdb_id] and [MUTATION_DOWNLOAD:filename.pdb]
   - Example user: "mutate residue 142 in chain A of PDB 1TUP from Alanine to Glycine"
   - Example response: "I have performed the in-silico mutation of Alanine 142 to Glycine in chain A of PDB 1TUP. Here is the new structure, and you can download the mutated PDB file. [PDB_VIEW:1TUP] [MUTATION_DOWNLOAD:1TUP_A_142_GLY.pdb]"

4. Conduct Literature Searches: To search PubMed.
   - Token: [PUBMED_SUMMARY:summary_content]
   - Example user: "summarize articles on protein design for thermostability"
   - Example response: "I have searched PubMed for literature on protein design for thermostability. Here is a summary of my findings. [PUBMED_SUMMARY:Several studies highlight the importance of...]"

5. Run Sequence Similarity Searches (BLAST):
   - Token: [BLAST_RESULT:blast_content]
   - Example user: "run blast on 1TUP chain A"
   - Example response: "I have performed a BLAST search for chain A of PDB ID 1TUP. Here are the results. [BLAST_RESULT:Sequences producing significant alignments: ...]"

Interaction Rules:
- Be Direct: Provide answers and results directly without rephrasing the user's question.
- Seek Clarification: If the user's request is ambiguous (e.g., "I want to mutate a residue in 1TUP"), ask for the necessary information to proceed (e.g., "Certainly. Which chain, residue number, and what amino acid would you like to mutate to?").
- Always be conversational and helpful.
"""

@app.route('/api/chat', methods=['POST'])
def chat_handler():
    try:
        # Securely get the API key from Vercel's environment variables
        api_key = os.environ.get('API_KEY')
        if not api_key:
            return jsonify({"error": "API_KEY environment variable not set."}), 500

        # Initialize the Gemini client
        ai = GoogleGenAI(api_key=api_key)

        # Get the message history from the frontend request
        request_data = request.get_json()
        if not request_data or 'messages' not in request_data:
            return jsonify({"error": "Invalid request body. 'messages' key is required."}), 400

        messages_from_frontend = request_data['messages']
        
        # The last message is the current user prompt
        user_prompt = messages_from_frontend[-1]['content']

        # Format the history for the Gemini API
        # The API expects roles to be 'user' and 'model'
        history_for_gemini = []
        for msg in messages_from_frontend[:-1]: # Exclude the last message (current prompt)
            author = msg.get('author')
            content = msg.get('content', '')
            if author == 'user':
                history_for_gemini.append({'role': 'user', 'parts': [{'text': content}]})
            elif author == 'rhesus':
                history_for_gemini.append({'role': 'model', 'parts': [{'text': content}]})

        # Start a chat session with the existing history
        chat_session = ai.chats.create(
            model='gemini-2.5-flash',
            history=history_for_gemini,
            config={'systemInstruction': DR_RHESUS_SYSTEM_INSTRUCTION}
        )

        # Send the new message
        response = chat_session.sendMessage(message=user_prompt)

        # Return the generated text to the frontend
        return jsonify({"text": response.text})

    except Exception as e:
        # Log the error for debugging on the Vercel dashboard
        print(f"An error occurred: {e}")
        return jsonify({"error": "An internal server error occurred."}), 500

# This is the entry point for Vercel
# Vercel will know how to handle the 'app' object
