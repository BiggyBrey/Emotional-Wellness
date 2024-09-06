import axios from "axios";
const API_URL = "/api/v1";

//#region apis for User
/**
 * Retrieves a list of all users.
 *
 * @returns {Promise} - A promise that resolves to a list of users.
 */
export const getUsers = () => axios.get(`${API_URL}/users`);

/**
 * Retrieves a single user document by user ID.
 *
 * @param {String} id - The ID of the user to be retrieved.
 * @returns {Promise} - A promise that resolves to a single user document.
 */
export const getUserById = (id) => axios.get(`${API_URL}/users/${id}`);

/**
 * Checks if a username is available.
 *
 * @param {String} username - The username to check for availability.
 * @returns {Promise} - A promise that resolves to an object with an `available` boolean property.
 *                       `true` if the username is available, `false` if the name is taken.
 */
export const checkUsername = (username) =>
  axios.get(`${API_URL}/users/check-username/${username}`);

/**
 * Creates a new user.
 *
 * @param {Object} user - The user data to be created. Should include necessary fields such as username, password, etc.
 * @returns {Promise} - A promise that resolves to the created user object.
 */
export const createUser = (user) =>
  axios.post(`${API_URL}/users/register`, user);

/**
 * Attempts to log in a user by checking if the username exists and the password matches.
 *
 * @param {Object} user - The login credentials including username and password.
 * @returns {Promise} - A promise that resolves to the user ID on successful login.
 */
export const loginUser = (user) => axios.post(`${API_URL}/users/login`, user);

/**
 * Updates the information of an existing user.
 *
 * @param {String} id - The ID of the user to be updated.
 * @param {Object} user - The updated user information.
 * @returns {Promise} - A promise that resolves to the updated user object.
 */
export const updateUser = (id, user) =>
  axios.put(`${API_URL}/users/${id}`, user);

/**
 * Deletes a user by user ID.
 *
 * @param {String} id - The ID of the user to be deleted.
 * @returns {Promise} - A promise that resolves to the response from the server confirming the deletion.
 */
export const deleteUser = (id) => axios.delete(`${API_URL}/users/${id}`);

//#endregion

//#region apis for Journals
/**
 * Retrieves an array of public journal entries.
 *
 * @returns {Promise} - A promise that resolves to an array of public journal entries.
 */
export const getPublicEntries = () => axios.get(`${API_URL}/journals`);

/**
 * Retrieves a single journal document by user ID.
 *
 * @param {String} userID - The ID of the user whose journal is to be retrieved.
 * @returns {Promise} - A promise that resolves to a single journal document.
 */
export const getJournalById = (userID) =>
  axios.get(`${API_URL}/journals/${userID}`);

/**
 * Creates a new journal entry.
 *
 * @param {Object} journal - The journal entry data to be created.
 * @returns {Promise} - A promise that resolves to the created journal object.
 */
export const createJournal = (journal) =>
  axios.post(`${API_URL}/journals/write`, journal);

/**
 * Updates an existing journal entry.
 *
 * @param {String} userID - The ID of the user whose journal entry is to be updated.
 * @param {String} entryID - The ID of the journal entry to be updated.
 * @param {Object} journal - The updated journal entry data.
 * @returns {Promise} - A promise that resolves to the updated journal object.
 */
export const updateJournal = (userID, entryID, journal) =>
  axios.put(`${API_URL}/journals/${userID}/${entryID}`, journal);

/**
 * Deletes a journal document by user ID.
 *
 * @param {String} userID - The ID of the user whose journal is to be deleted.
 * @returns {Promise} - A promise that resolves to the response from the server confirming the deletion.
 */
export const deleteJournal = (userID) =>
  axios.delete(`${API_URL}/journals/${userID}`);

/**
 * Deletes multiple entries from a journal in a batch operation.
 *
 * @param {String} userID - The ID of the user whose journal entries are to be deleted.
 * @param {Array<String>} entryIDs - An array of IDs of the entries to be deleted.
 * @returns {Promise} - A promise that resolves to the response from the server confirming the deletions. A promise that resolves to an object with an `missing_Entries` array<Object> property.
 *                       The array shows all entries that did not exist and failed to delete. Shows the journal doc, seeing all remaining entries.
 */
export const deleteBatch = (userID, entryIDs) =>
  axios.delete(`${API_URL}/journals/batch/${userID}`, { data: { entryIDs } });

/**
 * Deletes a specific entry from a journal.
 *
 * @param {String} userID - The ID of the user whose journal entry is to be deleted.
 * @param {String} entryID - The ID of the entry to be deleted.
 * @returns {Promise} - A promise that resolves to the response from the server confirming the deletion.
 */
export const deleteEntry = (userID, entryID) =>
  axios.delete(`${API_URL}/journals/${userID}/${entryID}`);

//#endregion
