import axios from "axios";
const API_URL = "/api/v1";
/**
 * Retrieves a single AiChat document by user ID.
 *
 * @param {String} userID - The ID of the user whose AiChat is to be retrieved.
 * @returns {Promise} - A promise that resolves to a single AiChat document.
 */
export const getAiChatById = (userID) =>
  axios.get(`${API_URL}/aichats/${userID}`);

/**
 * Creates a new AiChat entry.
 *
 * @param {Object} message - The message sent to Open AI. Expects userID, message and isNewConversation flag
 * @returns {Promise} - A promise that resolves to the created message object.
 */
export const startAiChat = (message) =>
  axios.post(`${API_URL}/aichats/chat`, message);

/**
 * Updates an existing AiChat entry.
 *
 * @param {String} convoID - The ID of the convo to be updated in AiChat.
 * @param {Object} message - The message object to be sent. Expects userID and message
 * @returns {Promise} - A promise that resolves to the updated AiChat object.
 */
export const continueAiChat = (convoID, message) =>
  axios.post(`${API_URL}/aichats/chat/${convoID}`, message);

/**
 * Deletes a AiChat document by user ID.
 *
 * @param {String} userID - The ID of the user whose AiChat is to be deleted.
 * @returns {Promise} - A promise that resolves to the response from the server confirming the deletion.
 */
export const deleteAiChat = (userID) =>
  axios.delete(`${API_URL}/aichats/${userID}`);

/**
 * Deletes multiple entries from a AiChat in a batch operation.
 *
 * @param {String} userID - The ID of the user whose AiChat entries are to be deleted.
 * @param {Array<String>} convoIDs - An array of IDs of the entries to be deleted.
 * @returns {Promise} - A promise that resolves to the response from the server confirming the deletions. A promise that resolves to an object with an `missing_Entries` array<Object> property.
 *                       The array shows all entries that did not exist and failed to delete. Shows the AiChat doc, seeing all remaining entries.
 */
export const deleteBatch = (userID, convoIDs) =>
  axios.delete(`${API_URL}/aichats/batch/${userID}`, { data: { convoIDs } });

/**
 * Deletes a specific entry from a AiChat.
 *
 * @param {String} userID - The ID of the user whose AiChat convo is to be deleted.
 * @param {String} convoID - The ID of the convo to be deleted.
 * @returns {Promise} - A promise that resolves to the response from the server confirming the deletion.
 */
export const deleteConversation = (userID, convoID) =>
  axios.delete(`${API_URL}/aichats/${userID}/${convoID}`);
