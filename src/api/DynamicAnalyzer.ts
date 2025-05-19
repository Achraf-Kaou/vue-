import axios from 'axios'

const API_KEY = import.meta.env.VITE_MOBSF_API_KEY
const API_URL = import.meta.env.VITE_MOBSF_API_URL

const headers = {
  Authorization: API_KEY,
  'Content-Type': 'multipart/form-data; boundary=<calculated when request is sent>',
}

interface DynamicAnalysisResponse {
  status: string
  message?: string
  data?: any
  android_version?: number
}

interface AppInfo {
  MD5: string
  APP_NAME: string
  VERSION_NAME: string
  FILE_NAME: string
  PACKAGE_NAME: string
  DYNAMIC_REPORT_EXISTS: boolean
  ICON_PATH: string
}

interface GetAppsResponse {
  android_sdk: string
  android_supported: number
  android_version: number
  apps: AppInfo[]
  device_packages: any[]
  identifier: string
  proxy_ip: string
  proxy_port: number
  settings_loc: string
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

interface listFridaScripts {
  status: string
  files: string[]
}

interface getFridaScript {
  status: string
  content: string
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
      const response = await axios.get(`${API_URL}/dynamic/get_apps`, { headers })
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
        `${API_URL}/dynamic/start_analysis`,
        { hash, re_install: reInstall, install },
        { headers }
      )
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  public async getLogcat(packageName: string): Promise<any> {
    try {
      const response = await axios.post(
        `${API_URL}/android/logcat`,
        { package: packageName },
        { headers }
      )
      console.log(JSON.stringify(response.data))
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  public async mobsfy(identifier: string): Promise<DynamicAnalysisResponse> {
    try {
      const response = await axios.post(
        `${API_URL}/android/mobsfy`,
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
        `${API_URL}/android/root_ca`,
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
        `${API_URL}/android/global_proxy`,
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
        `${API_URL}/android/activity`,
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
        `${API_URL}/android/tls_tests`,
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
        `${API_URL}/frida/instrument`,
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

  public async getFridaAPIMonitor(hash: string): Promise<any> {
    try {
      const response = await axios.post(
        `${API_URL}/frida/api_monitor`,
        { hash },
        { headers }
      )
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  public async getFridaLogs(hash: string): Promise<any> {
    try {
      const response = await axios.post(`${API_URL}/frida/logs`, { hash }, { headers })
      console.log(response.data)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  public async listFridaScripts(device: 'android' | 'ios'): Promise<listFridaScripts> {
    try {
      const response = await axios.post(
        `${API_URL}/frida/list_scripts`,
        { device },
        { headers }
      )
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  public async getFridaRuntimeDependencies(hash: string): Promise<DynamicAnalysisResponse> {
    try {
      const response = await axios.post(
        `${API_URL}/frida/get_dependencies`,
        { hash },
        { headers }
      )
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  public async getFridaScript(script: string, device: 'android' | 'ios'): Promise<getFridaScript> {
    try {
      const response = await axios.post(
        `${API_URL}/frida/get_script`,
        { 'scripts[]':script ,
          device
        },
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
        `${API_URL}/dynamic/stop_analysis`,
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
        `${API_URL}/dynamic/report_json`,
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
        `${API_URL}/dynamic/view_source`,
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