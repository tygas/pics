const BASE_URL = 'https://picsum.photos'
const LIST_ENDPOINT = '/v2/list'
export const PAGE_SIZE = 20

export interface PhotoT {
  id: string
  author: string
  width: number
  height: number
  url: string
  download_url: string
}

export async function fetchPhotos(
  params: {
    page?: number
    limit?: number
    [key: string]: any
  } = {}
): Promise<PhotoT[]> {
  const url = new URL(BASE_URL + LIST_ENDPOINT)
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.append(key, String(value))
    }
  })
  const response = await fetch(url.toString())
  if (!response.ok) {
    throw new Error(`Failed to fetch photos: ${response.status}`)
  }
  return response.json()
}
