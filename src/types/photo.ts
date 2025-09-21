export interface Photo {
  id: string
  author: string
  download_url: string
  width: number
  height: number
}

export interface PageData {
  pageNumber: number
  photos: Photo[]
  isLoaded: boolean
}

export interface VirtualizedPages {
  [pageNumber: number]: Photo[]
}
