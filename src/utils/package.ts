import path from 'path'
import { readFileSync } from 'fs'
import { ROOT } from '@/utils/path'

const PACKAGE_JSON_PATH = path.join(ROOT, 'package.json')
export const PACKAGE = JSON.parse(readFileSync(PACKAGE_JSON_PATH).toString())
