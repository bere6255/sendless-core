type token ={
    token: string
    type: string
}
export default ({token, type }: token)=>`Your tencoin ${type} code is ${token}.`