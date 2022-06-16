const connection = new signalR.HubConnectionBuilder().withUrl("https://localhost:44347/jogo").build();
start();

async function start() {
    try {
        await connection.start();
        console.log("SignalR Connected.");
    } catch (err) {
        console.log(err);
        setTimeout(start, 5000);
    }
};

async function setCampos(campos, player, X, Y)
{
    await connection.send("setCampos", (campos, player, X, Y, connection.connnectid));
 }

async function getCampos() {
     await connection.on("getCampos", (campos) => {
        return campos;
   });
}