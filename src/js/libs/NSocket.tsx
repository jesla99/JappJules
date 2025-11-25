//import Peer from "./simplepeer.js"
import { nsockets, miSocket } from "../vistas/bin/env.js"
import React from "./MiReact.js"

//objeto consockets seguros en el caso de ser server
var segSocket:any={}
//Nombre del socket al que se va a conectar en el caso de ser punto remoto
var socket:any
//modulo 
var modulo:any=undefined

class npeerAbs{
    protected lastPeerId:any
    protected peer:any
    protected conn:any
    protected enviar(msg){
        if (this.conn && this.conn.open) this.conn.send(msg);
        else console.log('Connection is closed')
    }
}
class npeerSocket extends npeerAbs{
    private peerId:any
    constructor(miId:null|string=null){
        super()
        this.peer = new window['Peer'](miId, {debug: 2})
        this.peer.on('open', id=>{
            if (this.peer.id === null) {
                console.log('se recibio un id de punto vacio.')
                this.peer.id = this.lastPeerId
            } else this.lastPeerId = this.peer.id
            console.log ('Socket id: ', this.peer.id)
        })

        this.peer.on('connection', c=>{
            if (this.conn && this.conn.open) {
                c.on('open', ()=>{
                    c.send("Lo sentimos este socket esta ocupado.")
                    setTimeout(()=>c.close(), 500)
                })
                return
            }
            this.conn = c
            console.log("✔ conectado a: " + this.conn.peer)
            this.ready()
        });
    }
    private ready() {
        this.conn.on('data', data=>{
            if (modulo != undefined && modulo['alSocket'] != undefined) {
                modulo['alSocket'](data, this.peerId)
            }else{
                console.log(data)
            }
        })
        this.conn.on('close', ()=>{
            console.log('✘ Conexion perdida, espere.. buscando conexion...')
            this.conn = null;
        });
    }
}
class npeerRemote extends npeerAbs{
    protected mkPeer(miPeer){
        if (miPeer !== null) miPeer=miPeer+"-r"
        this.peer = new window['Peer'](miPeer, {debug: 2})
        this.peer.on('open', id=> {
            if (this.peer.id === null) { 
                console.log('Se recibio un id nulo') 
                this.peer.id = this.lastPeerId
            } else this.lastPeerId = this.peer.id
            console.log('ID: ' + this.peer.id)
        })
        this.peer.on('connection', c => {
            c.on('open', function() {
                c.send("✘ No acepta conexiones entrantes")
                setTimeout(() =>{ c.close(); }, 500)
            })
        })
        this.peer.on('disconnected', ()=>{
            console.log('✘ Conexion perdida. por favor reconectar')
            this.peer.id = this.lastPeerId
            this.peer._lastServerId = this.lastPeerId
            this.peer.reconnect()
        })
        this.peer.on('close', ()=>{
            this.conn = null
            console.log('✘ Connection destruida')
        })
        this.peer.on('error', (err)=>{
            console.log(err)
            alert('✘ Error en Socket nanoPeer' + err)
        })
    }
    protected conectar(npeerID) {
        if (this.conn) {this.conn.close()}
        this.conn = this.peer.connect(npeerID, {reliable: true})
        this.conn.on('open', ()=>{console.log("Connected to: " + this.conn.peer)})
        this.conn.on('data', function (data) {
            if (modulo != undefined && modulo['alSocket'] != undefined) {
                modulo['alSocket'](data, {
                    socket_id:npeerID,
                    socket_tipo:"p2p",
                    data_tipo: React.estoEs(data)
                })
            }else{
                console.log(data)
            }
        })
        this.conn.on('close', ()=>{
            console.log("✘ Connection closed, re intentando conectar...")
            const id=this.peer.id.substring(0, this.peer.id.length-2)
            setTimeout(()=>{
                console.log("★ Intentando Reconectar...")
                this.conectar(id)
            }, 1000)
        })
    }
    protected getUrlParam(name) {
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]")
        var regexS = "[\\?&]" + name + "=([^&#]*)"
        var regex = new RegExp(regexS)
        var results = regex.exec(window.location.href)
        if (results == null) return null
        else return results[1]
    }
}

class NSocket{
    protected nsockets:any={}
    modulo:any=undefined
    constructor(){
        for(let s=0;s<nsockets.length;s++){
            const nombre =nsockets[s]
            segSocket[nombre] = new npeerSocket(nombre)
            this.nsockets[nombre]={
                estado:0,
                enviar:msg=>segSocket[nombre].enviar(msg)
            }
        }
    }

    //conectar remoto
    conectar(socketID){
        console.log(socket)
    }

    ///Para nodos remoto, crea una conexion a un socket existente
    crear(socketID){
        socketID=socketID
        socket=new npeerRemote()
        socket.mkPeer(socketID)
        setTimeout(()=>socket.conectar(socketID), 3000)
    }

    //para socket remoto que envian a un socket en el server
    enviar(msg, peer=null){
        if(peer === null)socket.enviar(msg)
        else {
            const sk:any = segSocket[peer]
            sk.enviar(msg)
        }
    }

    setModulo(modulo){
        this.modulo=modulo
    }
}

//objeto de sockets disponibles
const nSocket = new NSocket()
if (miSocket){
    nSocket.crear(miSocket)
}

export default nSocket