const asOptions = (fieldId, labels) => labels.map((label, index) => ({
  id: `${fieldId}-${index}`,
  label
}));
const q114Exhibit = new URL('../../PDF/Q114-exhibit.png', import.meta.url).href;

const imageQuestionCorrections = {
  71: {
    question: "You have a Microsoft Foundry project that contains a Retrieval Augmented Generation (RAG) solution.\n\nYou need to run a pre-production evaluation by using labeled CSV dataset that contains the query, context, response and ground truth. The evaluation must measure the following:\n\u2022 Whether responses address the user query\n\u2022 Whether responses are supported by the provided context\n\u2022 Whether responses contain sensitive or proprietary information\n\nWhich AI quality evaluation metrics should you use? To answer, select the appropriate options in the answer area.\n\nNOTE: Each correct selection is worth one point.",
    answerFields: [
      {
        id: 'grounding-query',
        label: 'To measure whether the responses are supported by the provided context and address the user query:',
        options: asOptions('grounding-query', [
          'Coherence and Fluency',
          'GPT similarity and F1 score',
          'Groundedness and Relevance',
          'Groundedness and ROUGE score'
        ])
      },
      {
        id: 'sensitive-proprietary',
        label: 'To measure whether responses contain sensitive or proprietary information:',
        options: asOptions('sensitive-proprietary', [
          'Hateful and unfair content',
          'Indirect attack',
          'Protected material',
          'Violent content'
        ])
      }
    ],
    correctAnswers: ['grounding-query:grounding-query-2', 'sensitive-proprietary:sensitive-proprietary-2'],
    gradingAvailable: true
  },
  77: {
    question: 'You have a Microsoft Foundry project that contains an agent.\n\nYou need to enable long-term memory to ensure that the agent can recall user preferences across separate conversations. Stored memories must be isolated per authenticated user without the client application manually generating user IDs.\n\nHow should you complete the Python code? To answer, drag the appropriate values to the correct targets. Each value may be used once, more than once, or not at all.\n\nNOTE: Each correct selection is worth one point.',
    type: 'Drag and Drop',
    questionType: 'drag-drop',
    sourceLabel: 'Values',
    targetLabel: 'Answer Area',
    code: 'from azure.ai.projects.models import MemorySearchTool,\n    PromptAgentDefinition\n\nmem_store_name = "agent_mem_store"\nmemory_tool = MemorySearchTool(\n    memory_store_name=mem_store_name,\n    scope=[scope]\n)\n\nagent_def = PromptAgentDefinition(\n    model="gpt-5.2",\n    instructions="You are a customer support assistant.",\n    tools=[tools]\n)',
    configurations: [
      { id: 'session', label: '"session"' },
      { id: 'conversation-id', label: '"{{$conversationId}}"' },
      { id: 'user-id', label: '"{{$userId}}"' },
      { id: 'mem-store-name', label: '[mem_store_name]' },
      { id: 'memory-tool', label: '[memory_tool]' },
      { id: 'support-memory-tool', label: 'MemorySearchTool("support_mem_store")' }
    ],
    pipelines: [
      { id: 'scope', label: 'scope' },
      { id: 'tools', label: 'tools' }
    ],
    correctAnswers: ['scope:user-id', 'tools:memory-tool'],
    gradingAvailable: true
  },
  85: {
    type: 'Drag and Drop',
    questionType: 'drag-drop',
    sourceLabel: 'Values',
    targetLabel: 'Answer Area',
    configurations: [
      { id: 'classify', label: 'classify' },
      { id: 'generate', label: 'generate' },
      { id: 'group', label: 'group' },
      { id: 'string', label: 'string' },
      { id: 'table', label: 'table' }
    ],
    pipelines: [
      { id: 'field-value-type', label: 'Field value type' },
      { id: 'field-method', label: 'Field method' }
    ],
    correctAnswers: ['field-value-type:string', 'field-method:generate'],
    gradingAvailable: true
  },
  86: {
    type: 'Drag and Drop',
    questionType: 'drag-drop',
    sourceLabel: 'Values',
    targetLabel: 'Answer Area',
    configurations: [
      { id: 'classify', label: 'classify' },
      { id: 'generate', label: 'generate' },
      { id: 'group', label: 'group' },
      { id: 'string', label: 'string' },
      { id: 'table', label: 'table' }
    ],
    pipelines: [
      { id: 'field-value-type', label: 'Field value type' },
      { id: 'field-method', label: 'Field method' }
    ],
    correctAnswers: ['field-value-type:string', 'field-method:generate'],
    gradingAvailable: true
  },
  93: {
    question: "You have a Microsoft Foundry project that contains a support application.\n\nYou create an evaluation named Run1 that has the following configurations:\n+ Includes risk and safety metrics\n+ Includes the protected material evaluation\n+ Includes harmful content metrics that use a medium severity threshold\n\nYou create an evaluation named Run2 that has the following configurations:\n+ Includes risk and safety metrics\n+ Includes the protected material evaluation\n+ Includes harmful content metrics that use a high severity threshold\n\nYou run both evaluations against a dataset named DB1 and receive the following results:\n+ Content harm defect rate of Run1: 12%\n+ Content harm defect rate of Run2: 4%\n+ Protected material evaluation of Run1: 6%\n+ Protected material evaluation of Run1: 6%\n\nYou start a fine-tuning job by using DB1. The job fails during automatic RAI checks for multiple content harm types. You discover that the content filtering configuration is set to high severity.\n\nYou start a fine-tuning job by using DB1. The job fails during automatic RAI checks for multiple content harm types. You discover that the content filtering configuration is set to high severity.\n\nFor each of the following statements, select Yes if the statement is true. Otherwise, select No.\nNOTE: Each correct selection is worth one point.",
    type: 'Yes/No Matrix',
    questionType: 'yes-no-matrix',
    statements: [
      { id: 'statement-1', text: 'Changing the content filtering configuration to low severity will resolve the fine-tuning job issues.' },
      { id: 'statement-2', text: 'The difference between the 12% and 4% content harm defect rate is consistent with the different severity thresholds used in Run1 and Run2.' },
      { id: 'statement-3', text: 'The identical 6% protected material evaluation scores across Run1 and Run2 indicate that this metric is unaffected by the change in severity threshold.' }
    ],
    correctAnswers: ['statement-1:no', 'statement-2:yes', 'statement-3:yes'],
    gradingAvailable: true
  },
  94: {
    type: 'Drag and Drop',
    questionType: 'drag-drop',
    sourceLabel: 'Options',
    targetLabel: 'Answer Area',
    configurations: [
      { id: 'hierarchical-spans', label: 'Hierarchical spans' },
      { id: 'kql-query-filter', label: 'A KQL query filter' },
      { id: 'sampling', label: 'Sampling' },
      { id: 'tool-call-attributes', label: 'Tool call attributes' },
      { id: 'trace-sampling-policy', label: 'Trace sampling policy' }
    ],
    pipelines: [
      { id: 'nested-operations', label: 'Capture all the nested operations across the entire agent run' },
      { id: 'tool-arguments-results', label: 'Record tool invocation arguments and results' }
    ],
    correctAnswers: ['nested-operations:hierarchical-spans', 'tool-arguments-results:tool-call-attributes'],
    gradingAvailable: true
  },
  98: {
    code: "resource existingKeyVault 'Microsoft.KeyVault/vaults@2024-11-01' existing = {\n  name: 'KV1'\n  scope: resourceGroup()\n}\n\nresource connection 'Microsoft.CognitiveServices/accounts/connections@2025-04-01-preview' = {\n  name: 'aiFoundryName-result'\n  parent: aiFoundry\n  properties: {\n    category: [category]\n    target: existingKeyVault.id\n    authType: [authType]\n    isSharedToAll: true\n    metadata: {\n      ApiType: 'Azure'\n      ResourceId: existingKeyVault.id\n      location: existingKeyVault.location\n    }\n  }\n}",
    answerFields: [
      {
        id: 'category',
        label: 'category',
        options: asOptions('category', ['AzureAIService', 'AzureKeyVault', 'AzureOpenAI'])
      },
      {
        id: 'auth-type',
        label: 'authType',
        options: asOptions('auth-type', ['AccountKey', 'AccountManagedIdentity', 'ApiKey'])
      }
    ],
    correctAnswers: ['category:category-1', 'auth-type:auth-type-1'],
    gradingAvailable: true
  },
  101: {
    question: 'You develop a test method to verify the results retrieved from a call to the Azure Vision in Foundry Tools API. The call is used to analyze the existence of company logos in images. The call returns a collection of brands named brands.\n\nYou have the following code segment:',
    code: 'for brand in image_analysis.brands:\n    if brand.confidence >= 0.75:\n        print(f"\\nLogo of {brand.name} between {brand.rectangle.x}, {brand.rectangle.y} and {brand.rectangle.w}, {brand.rectangle.h}")',
    questionType: 'yes-no-matrix',
    type: 'Yes/No Matrix',
    statements: [
      { id: 'statement-1', text: 'The code will display the name of each detected brand with a confidence equal to or higher than 75 percent.' },
      { id: 'statement-2', text: 'The code will display coordinates for the top-left corner of the rectangle that contains the brand logo of the displayed brands.' },
      { id: 'statement-3', text: 'The code will display coordinates for the bottom-right corner of the rectangle that contains the brand logo of the displayed brands.' }
    ],
    correctAnswers: ['statement-1:yes', 'statement-2:yes', 'statement-3:no'],
    gradingAvailable: true
  },
  103: {
    question: 'You have an Azure subscription.\n\nYou need to create a new resource that will generate fictional stores in response to user prompts. The solution must ensure that the resource uses a customer-managed key to protect data.\n\nHow should you complete the script? To answer, select the appropriate options in the answer area.\n\nNOTE: Each correct selection is worth one point.',
    type: 'Dropdown',
    questionType: 'multi-dropdown',
    answerFields: [
      {
        id: 'kind',
        label: 'kind',
        options: asOptions('kind', ['AI Services', 'LanguageAuthoring', 'OpenAI'])
      },
      {
        id: 'api-properties',
        label: 'api-properties',
        options: asOptions('api-properties', ['--api-properties', '--assign-identity', '--encryption'])
      }
    ],
    correctAnswers: ['kind:kind-2', 'api-properties:api-properties-2'],
    gradingAvailable: true
  },
  104: {
    type: 'Dropdown',
    questionType: 'multi-dropdown',
    code: 'def get_self_harm_severity(comment: str) -> int:\n    key = os.environ["CONTENT_SAFETY_KEY"]\n    endpoint = os.environ["CONTENT_SAFETY_ENDPOINT"]\n    client = ContentSafetyClient(endpoint, AzureKeyCredential(key))\n    request = [request]\n    response = [response]\n    result = next(\n        item for item in response.categories_analysis\n        if item.category == TextCategory.SELF_HARM\n    )\n    return result.severity',
    answerFields: [
      {
        id: 'request',
        label: 'request',
        options: asOptions('request', [
          'AnalyzeTextOptions(categories=comment)',
          'AnalyzeTextOptions(text=[comment])',
          'AnalyzeTextOptions(text=comment)',
          'TextCategory.SELF_HARM(comment)'
        ])
      },
      {
        id: 'response',
        label: 'response',
        options: asOptions('response', [
          'client.analyze_image(request)',
          'client.analyze_text(request)',
          'client.moderate_text(request)',
          'client.path("/text:analyze").post(request)'
        ])
      }
    ],
    correctAnswers: ['request:request-2', 'response:response-1'],
    gradingAvailable: true
  },
  105: {
    question: 'You have a custom named entity recognition (NER) project in Azure Language in Foundry Tools for support tickets. The schema for the project contains an entity type named ContactInfo.\n\nIn tagged training files, ContactInfo is used for phone numbers, email addresses, and social media handles.\n\nModel evaluation shows low precision for ContactInfo, including false positives in which nearby text is extracted as ContactInfo.\n\nYou need to improve the precision of the project.\n\nWhat should you do before retraining the model?',
    type: 'Multiple Choice',
    questionType: 'single-choice',
    options: [
      { id: 'a', label: 'A. Lower the confidence threshold for ContactInfo.' },
      { id: 'b', label: 'B. Trigger an auto-labeling job.' },
      { id: 'c', label: 'C. Add more support tickets as training data and label more ContactInfo entities.' },
      { id: 'd', label: 'D. Replace ContactInfo by using Phone, Email, and SocialMedia entities. Relabel every matching span.' }
    ],
    correctAnswers: ['d'],
    gradingAvailable: true
  },
  113: {
    type: 'Dropdown',
    questionType: 'multi-dropdown',
    code: 'PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/Microsoft.CognitiveServices/accounts/{accountName}?api-version=2021-04-30\n{\n  "location": "West US",\n  "kind": [kind],\n  "sku": { "name": "S0" },\n  "properties": {},\n  "identity": { "type": "SystemAssigned" }\n}',
    answerFields: [
      {
        id: 'http-method',
        label: 'HTTP method',
        options: asOptions('http-method', ['PATCH', 'POST', 'PUT'])
      },
      {
        id: 'kind',
        label: 'kind',
        options: asOptions('kind', ['CognitiveServices', 'ComputerVision', 'TextAnalytics'])
      }
    ],
    correctAnswers: ['http-method:http-method-2', 'kind:kind-0'],
    gradingAvailable: true
  },
  114: {
    image: q114Exhibit,
    imageAlt: 'Q114 object detection model performance exhibit showing precision, recall, and mAP metrics.'
  }
};

export function applyImageQuestionCorrections(question) {
  const correction = imageQuestionCorrections[question.number];
  return correction ? { ...question, ...correction } : question;
}
