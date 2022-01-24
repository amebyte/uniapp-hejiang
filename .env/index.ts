import h5Dev from './env.h5.dev'
let ENV_VAR = null as any
console.log('process', process)
if (process.env.NODE_ENV == "development") {
	ENV_VAR = h5Dev
} else if (process.env.NODE_ENV == "H5-PROD") {
	ENV_VAR = require('./env.h5.prod.ts').default
} else if(process.env.NODE_ENV === 'MINI-DEV') {
	ENV_VAR = require('./env.mini.dev.ts').default
} else if(process.env.NODE_ENV === 'MINI-PROD') {
	ENV_VAR = require('./env.mini.prod.ts').default
}

if (ENV_VAR) {
  (process as any).uniEnv = {}
  for (let key in ENV_VAR) {  
    (process as any).uniEnv[key] = ENV_VAR[key]
  }  
}