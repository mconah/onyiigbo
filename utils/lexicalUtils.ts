/**
 * Returns a JSON string representation of an empty Lexical editor state.
 * Useful for initializing the editor with no content.
 */
export const emptyEditorState = JSON.stringify({
    root: {
        children: [{
            children: [],
            direction: null,
            format: "",
            indent: 0,
            type: "paragraph",
            version: 1
        }],
        direction: null,
        format: "",
        indent: 0,
        type: "root",
        version: 1
    }
});

/**
 * Serializes a Lexical EditorState object into a JSON string.
 * This string can be stored in a database (e.g., Appwrite).
 * @param editorState The Lexical EditorState object.
 * @returns A JSON string representing the editor's state.
 */
export const serializeEditorState = (editorState: any): string => {
  return JSON.stringify(editorState.toJSON());
};

/**
 * Deserializes a JSON string into a state object that can be used by Lexical.
 * This is used to load previously saved content into the editor or renderer.
 * @param jsonString The JSON string of the editor's state.
 * @returns The parsed state object or null if parsing fails.
 */
export const deserializeEditorState = (jsonString: string): any => {
  try {
      return JSON.parse(jsonString);
  } catch (e) {
      console.warn("Failed to parse Lexical editor state JSON, returning empty state.", e);
      return JSON.parse(emptyEditorState); // Fallback to empty state
  }
};