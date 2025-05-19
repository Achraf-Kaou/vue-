// Common types for Static Analysis components

export interface SecurityScore {
  security_score: number
  trackers: number
  total_trackers: number
  average_cvss: number
}

export interface FileInfo {
  file_name: string
  size: string
  md5: string
  sha1: string
  sha256: string
}

export interface AppInfo {
  app_name: string
  package_name: string
  main_activity: string
  target_sdk: string
  min_sdk: string
  max_sdk: string
  version_name: string
  version_code: string
  icon_path?: string
}

export interface Components {
  activities?: string[]
  services?: string[]
  receivers?: string[]
  providers?: string[]
  libraries?: string[]
  sbom?: {
    sbom_versioned: string[]
  }
  files?: string[]
}

export interface SecurityData {
  appsec: SecurityScore
  fileInfo: FileInfo
  appInfo: AppInfo
  components: Components
}

// Android specific types
export interface AndroidManifest {
  package_name: string
  version_name: string
  version_code: string
  min_sdk: string
  target_sdk: string
  permissions: string[]
  activities: string[]
  services: string[]
  receivers: string[]
  providers: string[]
}

export interface AndroidCertificate {
  issuer: string
  subject: string
  valid_from: string
  valid_to: string
  serial_number: string
  signature_algorithm: string
}

// iOS specific types
export interface iOSInfo {
  bundle_id: string
  bundle_name: string
  bundle_version: string
  bundle_short_version: string
  minimum_os_version: string
  platform_version: string
  sdk_version: string
}

export interface iOSBinary {
  architecture: string
  platform: string
  sdk: string
  min_os_version: string
  size: number
  type: string
  uuid: string
}

export interface iOSDylib {
  name: string
  path: string
  size: number
  type: string
  uuid: string
}

// Common component props
export interface BaseComponentProps {
  data: any
  loading?: boolean
  error?: string | null
}

export interface AnalysisComponentProps extends BaseComponentProps {
  fileHash: string
  onUpdate?: (data: any) => void
}

// Common component events
export interface AnalysisEvents {
  'update:data': (data: any) => void
  'error': (error: string) => void
  'loading': (loading: boolean) => void
}
