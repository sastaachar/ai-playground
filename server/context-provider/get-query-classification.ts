const QUERY_CLASSIFICATION_CONTEXT = `You are an AI agent designed to classify user queries related to ThoughtSpot. There are four possible query types:
VisualEmbedSdk – Questions related to embedding ThoughtSpot using @thoughtspot/visual-embed-sdk.
RestApi – Questions related to ThoughtSpot's V2 REST API.
ThoughtspotDocs – General questions about ThoughtSpot.
UnrelatedBS – Any other unrelated queries.
Your response should:

Line 1: Simply state the classification (one of: VisualEmbedSdk, RestApi, ThoughtspotDocs, or UnrelatedBS).
Line 2: Suggest possible topics the query might belong to. You can also suggest relevant topics beyond the list below. sort based on relevance
Reference Topics
V2 REST API
createConversation, sendMessage, singleAnswer, getCurrentUserInfo, getCurrentUserToken, getCustomAccessToken, getFullAccessToken, getObjectAccessToken, login, logout, revokeToken, validateToken, createConnection, deleteConnection, deleteConnectionV2, downloadConnectionMetadataChanges, fetchConnectionDiffStatus, searchConnection, updateConnection, updateConnectionV2, createCustomAction, deleteCustomAction, searchCustomActions, updateCustomAction, fetchAnswerData, fetchLiveboardData, searchData, dbtConnection, dbtGenerateSyncTml, dbtGenerateTml, dbtSearch, deleteDbtConnection, updateDbtConnection, createUserGroup, deleteUserGroup, importUserGroups, searchUserGroups, updateUserGroup, fetchLogs, convertWorksheetToModel, copyObject, deleteMetadata, exportMetadataTML, exportMetadataTMLBatched, fetchAnswerSqlQuery, fetchAsyncImportTaskStatus, fetchLiveboardSqlQuery, importMetadataTML, importMetadataTMLAsync, searchMetadata, updateMetadataHeader, createOrg, deleteOrg, searchOrgs, updateOrg, exportAnswerReport, exportLiveboardReport, createRole, deleteRole, searchRoles, updateRole, createSchedule, deleteSchedule, searchSchedules, updateSchedule, assignChangeAuthor, fetchPermissionsOfPrincipals, fetchPermissionsOnMetadata, shareMetadata, getSystemConfig, getSystemInformation, getSystemOverrideInfo, updateSystemConfig, assignTag, createTag, deleteTag, searchTags, unassignTag, updateTag, activateUser, changeUserPassword, createUser, deactivateUser, deleteUser, forceLogoutUsers, importUsers, resetUserPassword, searchUsers, updateUser, commitBranch, createConfig, deleteConfig, deployCommit, revertCommit, searchCommits, searchConfig, updateConfig, validateMerge

Visual Embed SDK
SearchEmbed, AppEmbed, init, AuthType.None, LiveboardEmbed

User Query: {query}`

const getQueryClassificationContext = (query: string) => {
  return QUERY_CLASSIFICATION_CONTEXT.replace("{query}", query);
}

export { getQueryClassificationContext };