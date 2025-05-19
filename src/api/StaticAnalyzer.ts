import axios from 'axios'
import type { AxiosInstance, AxiosResponse } from 'axios'
// Define interfaces for response types
interface FileUploadResponse {
  hash: string
  file_name: string
  scan_type: string
  [key: string]: any
}

interface ScanResponse {
  content: Scan[]
  count: number
  num_pages: number
}

interface Scan {
  ANALYZER: string
  SCAN_TYPE: string
  FILE_NAME: string
  APP_NAME: string
  PACKAGE_NAME: string
  VERSION_NAME: string
  MD5: string
  TIMESTAMP: string
  SCAN_LOGS: string
  type?: string
  status?: string
}

interface ScoreCardResponse {
  security_score: number
  findings: {
    [key: string]: number
  }
  [key: string]: any
}

interface SearchResult {
  id: number
  app_name: string
  package_name: string
  hash: string
  file_name: string
  [key: string]: any
}

interface Task {
  id: number
  file_name: string
  description: string
  type: string
  status: string
  progress: number
  timestamp: string
  requested_by: string
}

export class StaticAnalyzerService {
  private baseUrl: string
  private apiKey: string
  private api: AxiosInstance

  constructor() {
    // Base URL for MobSF API - can be configured through environment variables
    this.baseUrl = import.meta.env.VITE_MOBSF_API_URL

    // API key for authentication - should be stored in environment variables
    this.apiKey =
      import.meta.env.VITE_MOBSF_API_KEY

    // Create axios instance with default headers
    this.api = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'X-Mobsf-Api-Key': this.apiKey,
      },
    })
  }

  /**
   * Upload a file to MobSF for analysis
   *
   * @param {File} file - The file to upload (apk, zip, ipa or appx)
   * @returns {Promise<AxiosResponse<FileUploadResponse>>} - Response with file info
   */
  async uploadFile(file: File): Promise<AxiosResponse<FileUploadResponse>> {
    const formData = new FormData()
    formData.append('file', file)

    return this.api.post<FileUploadResponse>('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  }

  /**
   * Scan an uploaded file
   *
   * @param {string} hash - Hash of the file to scan
   * @param {boolean} reScan - Whether to rescan the file (default: false)
   * @returns {Promise<AxiosResponse<ScanResponse>>} - Response with scan results
   */
  async scanFile(hash: string, reScan = false): Promise<AxiosResponse<ScanResponse>> {
    const formData = new URLSearchParams()
    formData.append('hash', hash)
    formData.append('re_scan', reScan ? '1' : '0')

    return this.api.post<ScanResponse>('/scan', formData)
  }

  /**
   * Get live scan logs for a file
   *
   * @param {string} hash - Hash of the scanning file
   * @returns {Promise<AxiosResponse<any>>} - Response with scan logs
   */
  async getScanLogs(hash: string): Promise<AxiosResponse<any>> {
    const formData = new URLSearchParams()
    formData.append('hash', hash)

    return this.api.post<any>('/scan_logs', formData)
  }

  /**
   * Search for scan results
   *
   * @param {string} query - Search term (MD5, app name, package name, or file name)
   * @returns {Promise<AxiosResponse<SearchResult[]>>} - Response with search results
   */
  async search(query: string): Promise<AxiosResponse<SearchResult[]>> {
    const formData = new URLSearchParams()
    formData.append('query', query)

    return this.api.post<SearchResult[]>('/search', formData)
  }

  /**
   * Delete scan results for a file
   *
   * @param {string} hash - Hash of the file
   * @returns {Promise<AxiosResponse<any>>} - Response with deletion status
   */
  async deleteScan(hash: string): Promise<AxiosResponse<any>> {
    const formData = new URLSearchParams()
    formData.append('hash', hash)

    return this.api.post<any>('/delete_scan', formData)
  }

  /**
   * Get application security scorecard
   *
   * @param {string} hash - Hash of the file
   * @returns {Promise<AxiosResponse<ScoreCardResponse>>} - Response with security scorecard
   */
  async getScorecard(hash: string): Promise<AxiosResponse<ScoreCardResponse>> {
    const formData = new URLSearchParams()
    formData.append('hash', hash)

    return this.api.post<ScoreCardResponse>('/scorecard', formData)
  }

  /**
   * Generate and download PDF report
   *
   * @param {string} hash - Hash of the file
   * @returns {Promise<AxiosResponse<Blob>>} - Response with PDF content
   */
  async downloadPdfReport(hash: string): Promise<AxiosResponse<Blob>> {
    const formData = new URLSearchParams()
    formData.append('hash', hash)

    return this.api.post<Blob>('/download_pdf', formData, {
      responseType: 'blob',
    })
  }

  /**
   * Get JSON report
   *
   * @param {string} hash - Hash of the file
   * @returns {Promise<AxiosResponse<any>>} - Response with report in JSON format
   */
  async getJsonReport(hash: string): Promise<AxiosResponse<any>> {
    const formData = new URLSearchParams()
    formData.append('hash', hash)

    return this.api.post<any>('/report_json', formData)
  }

  /**
   * View source file content
   *
   * @param {string} hash - Hash of the file
   * @param {string} file - Relative file path
   * @param {string} type - File type (apk/ipa/studio/eclipse/ios)
   * @returns {Promise<AxiosResponse<any>>} - Response with source file content
   */
  async viewSourceFile(hash: string, file: string, type: string): Promise<AxiosResponse<any>> {
    const formData = new URLSearchParams()
    formData.append('hash', hash)
    formData.append('file', file)
    formData.append('type', type)

    return this.api.post<any>('/view_source', formData)
  }

  /**
   * Get recent scans
   *
   * @param {number} page - Page number (default: 1)
   * @param {number} pageSize - Items per page (default: 10)
   * @returns {Promise<AxiosResponse<ScanResponse>>} - Response with scan history
   */
  async getRecentScans(page = 1, pageSize = 10): Promise<AxiosResponse<ScanResponse>> {
    return this.api.get<ScanResponse>('/scans', {
      params: {
        page,
        page_size: pageSize,
      },
    })
  }

  /**
   * Get scan tasks in queue (when async scan queue is enabled)
   *
   * @returns {Promise<AxiosResponse<Task[]>>} - Response with tasks in queue
   */
  async getScanTasks(): Promise<AxiosResponse<Task[]>> {
    return this.api.post<Task[]>('/tasks')
  }

  /**
   * Suppress findings by rule ID
   *
   * @param {string} hash - Hash of the file
   * @param {string} type - Type of finding ('code' or 'manifest')
   * @param {string} rule - Rule ID to suppress
   * @returns {Promise<AxiosResponse<any>>} - Response with suppression status
   */
  async suppressByRule(hash: string, type: string, rule: string): Promise<AxiosResponse<any>> {
    const formData = new URLSearchParams()
    formData.append('hash', hash)
    formData.append('type', type)
    formData.append('rule', rule)

    return this.api.post<any>('/suppress_by_rule', formData)
  }

  /**
   * Suppress findings by files
   *
   * @param {string} hash - Hash of the file
   * @param {string} type - Type of finding ('code')
   * @param {string} rule - Rule ID to suppress
   * @returns {Promise<AxiosResponse<any>>} - Response with suppression status
   */
  async suppressByFiles(hash: string, type: string, rule: string): Promise<AxiosResponse<any>> {
    const formData = new URLSearchParams()
    formData.append('hash', hash)
    formData.append('type', type)
    formData.append('rule', rule)

    return this.api.post<any>('/suppress_by_files', formData)
  }

  /**
   * List suppressions for a scan
   *
   * @param {string} hash - Hash of the file
   * @returns {Promise<AxiosResponse<any>>} - Response with list of suppressions
   */
  async listSuppressions(hash: string): Promise<AxiosResponse<any>> {
    const formData = new URLSearchParams()
    formData.append('hash', hash)

    return this.api.post<any>('/list_suppressions', formData)
  }

  /**
   * Delete a suppression
   *
   * @param {string} hash - Hash of the file
   * @param {string} type - Type of finding ('code' or 'manifest')
   * @param {string} rule - Rule ID
   * @param {string} kind - Kind of suppression ('rule' or 'file')
   * @returns {Promise<AxiosResponse<any>>} - Response with deletion status
   */
  async deleteSuppression(
    hash: string,
    type: string,
    rule: string,
    kind: string
  ): Promise<AxiosResponse<any>> {
    const formData = new URLSearchParams()
    formData.append('hash', hash)
    formData.append('type', type)
    formData.append('rule', rule)
    formData.append('kind', kind)

    return this.api.post<any>('/delete_suppression', formData)
  }
}

// Create and export the singleton instance
const staticAnalyzerService = new StaticAnalyzerService()
export default staticAnalyzerService
