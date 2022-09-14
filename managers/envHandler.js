
const envHandler = envName =>{
    const env = process.env[envName];
    if(!env) throw new Error(`ENV ${envName} is not defined.`)
    return env
}

export default envHandler