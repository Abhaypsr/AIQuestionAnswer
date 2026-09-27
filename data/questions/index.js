export const questions = [
  {
    id: 'q3',
    number: 3,
    type: 'Multiple Choice',
    questionType: 'single-choice',
    question: 'You are planning a Microsoft Foundry project named Project1 that will contain multiple agents. Each agent will access the same Azure AI Search resource. You need to recommend a solution to centrally manage the Azure AI Search credentials within Project1. The solution must be implemented across all the agents. What should you recommend?',
    options: [
      { id: 'a', label: 'A. Enable role-based access control (RBAC) for the Azure AI Search resource.' },
      { id: 'b', label: 'B. Disable key-based access control on the Azure AI Search resource.' },
      { id: 'c', label: 'C. Add a connection to the Azure AI Search resource.' },
      { id: 'd', label: 'D. Create a managed private endpoint that connects to the Azure AI Search resource.' }
    ],
    correctAnswers: ['c']
  },
  {
    id: 'q4',
    number: 4,
    type: 'Hotspot',
    questionType: 'yes-no-matrix',
    question: 'HOTSPOT -\nYour company is piloting a customer support agent in a Microsoft Foundry project name Project1. Project1 is connected to an existing Application Insights resource, and the company’s support team reviews runs in the Traces tab.\n\nThe Foundry Agent Service is configured to perform the following actions:\nRetrieve the Application Insights connection string by calling project_client.telemetry.get_application_insights_connection_string().\nCall configure_azure_monitor(connection_string=...) to enable telemetry.\n\nA separate LangChain service is configured to use OpenTelemetry and has the following configurations:\nUses AzureAIOpenTelemetryTracer(connection_string=..., enable_content_recording=False)\nPasses the tracer by using config={"callbacks":[azure_tracer]}\n\nCompany policy has the following requirements:\nTelemetry from LangChain and OpenTelemetry must be distinguishable within the same Application Insights resource.\nSecrets and credentials must NOT be stored in prompts, tool arguments, or span attributes.\n\nFor each of the following statements, select Yes if the statement is true. Otherwise, select No.\nNOTE: Each correct selection is worth one point.',
    statements: [
      {
        id: 'langchain-traces',
        text: 'The LangChain service will appear in Traces without configuring a tracer.'
      },
      {
        id: 'service-name',
        text: 'Setting different OTEL_SERVICE_NAME values separates the services in Application Insights.'
      },
      {
        id: 'content-recording',
        text: 'When using enable_content_recording=False, prompts and tool data will be captured in the telemetry.'
      }
    ],
    correctAnswers: ['langchain-traces:no', 'service-name:yes', 'content-recording:no']
  },
  {
    id: 'q5',
    number: 5,
    type: 'Drag and Drop',
    questionType: 'drag-drop',
    question: 'DRAG DROP -\nYou have a Microsoft Foundry project that processes procurement documents submitted by suppliers.\n\nYou need to implement two pipelines by using Azure Content Understanding in Foundry Tools. The solution must meet the following requirements:\nInclude a pipeline named Pipeline1 that supports cost-effective, high-volume processing of standalone PDF invoices.\nInclude a pipeline named Pipeline2 that supports cross-document validation by using multi-step reasoning and reference data.\n\nHow should you configure each pipeline? To answer, drag the appropriate configurations to the correct pipelines. Each configuration may be used once, more than once, or not at all. You may need to drag the split bar between panes or scroll to view content.\nNOTE: Each correct selection is worth one point.',
    configurations: [
      { id: 'multi-file-pro', label: 'Multi-file task in pro mode' },
      { id: 'multi-file-standard', label: 'Multi-file task in standard mode' },
      { id: 'single-file-pro', label: 'Single-file task in pro mode' },
      { id: 'single-file-standard', label: 'Single-file task in standard mode' }
    ],
    pipelines: [
      { id: 'pipeline1', label: 'Pipeline1' },
      { id: 'pipeline2', label: 'Pipeline2' }
    ],
    correctAnswers: ['pipeline1:single-file-standard', 'pipeline2:multi-file-pro']
  }
];
