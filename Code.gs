// Webアプリケーションとしてデプロイした際のエンドポイント処理
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents)
    return handleRequest('POST', data)
  } catch (error) {
    return createErrorResponse(error)
  }
}

function doGet(e) {
  try {
    return handleRequest('GET', e.parameter)
  } catch (error) {
    return createErrorResponse(error)
  }
}

// リクエストのルーティング処理
function handleRequest(method, data) {
  const endpoints = {
    'POST': {
      '/reservation': createReservation
    },
    'GET': {
      '/availability': getAvailability
    }
  }

  const path = data.path || '/reservation'
  const handler = endpoints[method][path]

  if (!handler) {
    throw new Error('Invalid endpoint')
  }

  const result = handler(data)
  return createResponse(result)
}

// レスポンス生成
function createResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON)
}

function createErrorResponse(error) {
  return ContentService.createTextOutput(JSON.stringify({
    error: error.message || 'Internal server error'
  }))
    .setMimeType(ContentService.MimeType.JSON)
} 