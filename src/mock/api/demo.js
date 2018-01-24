// mock-demo
import fetch from '@/config/fetch'
import { API_PATH } from '@/config/env'

// demo
export const examplesDemo = (dataJson) => fetch(API_PATH + '/examples/demo', dataJson, 'GET')
