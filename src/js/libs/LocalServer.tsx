export default class Server{
    loadScript = async (script:string) => {
        //const module = await import(/* webpackChunkName: "my-script" */ '/dist/js/local/'+ script +'.js')
        const module = await import('../local/'+ script +'.js')
        // Utiliza las exportaciones del módulo
        return module.default
    };

    async run(verb, endPoint, body={}){
        const partes = this.parse(endPoint)
        const mod = await this.loadScript(partes[1])

        const local = new mod()

        return await local.run(verb, endPoint, body)
    }

    parse(endPoint){
        const partes = endPoint.split("/")
        return partes
    }
}