import axios from 'axios'

const API_KEY = '080a09ca0616631877987768d6e6c43880417708f3ac0731b0113bd465f3ecb2'
const API_URL = 'http://localhost:8000'

const headers = {
  Authorization: API_KEY,
  'Content-Type': 'application/json',
}

interface DynamicAnalysisResponse {
  status: string
  message?: string
  data?: any
}

interface AppInfo {
  MD5: string
  APP_NAME: string
  VERSION_NAME: string
  FILE_NAME: string
  PACKAGE_NAME: string
}

interface GetAppsResponse {
  apks: AppInfo[]
  identifier: string
  proxy_ip: string
  proxy_port: number
  title: string
  version: string
}

interface FridaInstrumentationParams {
  hash: string
  defaultHooks: string[]
  auxiliaryHooks: string[]
  fridaCode: string
  className?: string
  classSearch?: string
  classTrace?: string
  fridaAction?: 'spawn' | 'session' | 'ps'
  newPackage?: string
  pid?: number
}

class DynamicAnalyzer {
  private static instance: DynamicAnalyzer

  private constructor() {}

  public static getInstance(): DynamicAnalyzer {
    if (!DynamicAnalyzer.instance) {
      DynamicAnalyzer.instance = new DynamicAnalyzer()
    }
    return DynamicAnalyzer.instance
  }

  public async getApps(): Promise<GetAppsResponse> {
    try {
      const response = await axios.get(`${API_URL}/api/v1/dynamic/get_apps`, { headers })
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  public async startAnalysis(
    hash: string,
    reInstall: number = 1,
    install: number = 1
  ): Promise<DynamicAnalysisResponse> {
    try {
      const response = await axios.post(
        `${API_URL}/api/v1/dynamic/start_analysis`,
        { hash, re_install: reInstall, install },
        { headers }
      )
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  public async getLogcat(packageName: string): Promise<DynamicAnalysisResponse> {
    try {
      const response = await axios.post(
        `${API_URL}/api/v1/android/logcat`,
        { package: packageName },
        { headers }
      )
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  public async mobsfy(identifier: string): Promise<DynamicAnalysisResponse> {
    try {
      const response = await axios.post(
        `${API_URL}/api/v1/android/mobsfy`,
        { identifier },
        { headers }
      )
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  public async rootCA(action: 'install' | 'remove'): Promise<DynamicAnalysisResponse> {
    try {
      const response = await axios.post(
        `${API_URL}/api/v1/android/root_ca`,
        { action },
        { headers }
      )
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  public async globalProxy(action: 'set' | 'unset'): Promise<DynamicAnalysisResponse> {
    try {
      const response = await axios.post(
        `${API_URL}/api/v1/android/global_proxy`,
        { action },
        { headers }
      )
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  public async runActivityTest(
    hash: string,
    test: 'exported' | 'activity'
  ): Promise<DynamicAnalysisResponse> {
    try {
      const response = await axios.post(
        `${API_URL}/api/v1/android/activity`,
        { hash, test },
        { headers }
      )
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  public async runTLSTests(hash: string): Promise<DynamicAnalysisResponse> {
    try {
      const response = await axios.post(
        `${API_URL}/api/v1/android/tls_tests`,
        { hash },
        { headers }
      )
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  public async instrumentFrida(
    params: FridaInstrumentationParams
  ): Promise<DynamicAnalysisResponse> {
    try {
      const response = await axios.post(
        `${API_URL}/api/v1/frida/instrument`,
        {
          hash: params.hash,
          default_hooks: params.defaultHooks.join(','),
          auxiliary_hooks: params.auxiliaryHooks.join(','),
          frida_code: params.fridaCode,
          class_name: params.className,
          class_search: params.classSearch,
          class_trace: params.classTrace,
          frida_action: params.fridaAction,
          new_package: params.newPackage,
          pid: params.pid,
        },
        { headers }
      )
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  public async getFridaAPIMonitor(hash: string): Promise<DynamicAnalysisResponse> {
    try {
      const response = await axios.post(
        `${API_URL}/api/v1/frida/api_monitor`,
        { hash },
        { headers }
      )
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  public async getFridaLogs(hash: string): Promise<DynamicAnalysisResponse> {
    try {
      const response = await axios.post(`${API_URL}/api/v1/frida/logs`, { hash }, { headers })
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  public async listFridaScripts(device: 'android' | 'ios'): Promise<DynamicAnalysisResponse> {
    try {
      const response = await axios.post(
        `${API_URL}/api/v1/frida/list_scripts`,
        { device },
        { headers }
      )
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  public async stopAnalysis(hash: string): Promise<DynamicAnalysisResponse> {
    try {
      const response = await axios.post(
        `${API_URL}/api/v1/dynamic/stop_analysis`,
        { hash },
        { headers }
      )
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  public async getReport(hash: string): Promise<DynamicAnalysisResponse> {
    try {
      const response = await axios.post(
        `${API_URL}/api/v1/dynamic/report_json`,
        { hash },
        { headers }
      )
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  public async viewSource(
    hash: string,
    file: string,
    type: 'xml' | 'db' | 'others'
  ): Promise<DynamicAnalysisResponse> {
    try {
      const response = await axios.post(
        `${API_URL}/api/v1/dynamic/view_source`,
        { hash, file, type },
        { headers }
      )
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  private handleError(error: any): Error {
    if (axios.isAxiosError(error)) {
      return new Error(error.response?.data?.error || error.message)
    }
    return error
  }
}

export const dynamicAnalyzer = DynamicAnalyzer.getInstance()
