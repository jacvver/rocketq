const Database = require("../db/config")

module.exports = {
    async create(req, res) {
        const db = await Database()
        const pass = req.body.password
        let roomId
        let isRoom = true
        while(isRoom){
            /* Gera o número da sala */
            for(var i = 0; i < 6; i++) {
                i == 0 ? roomId = Math.floor(Math.random() * 10).toString() : roomId += Math.floor(Math.random() * 10).toString()
            }

            /* Verificar se esse número já existe */
            const roomsExistIds = await db.all(`SELECT id FROM rooms`)
            isRoom = roomsExistIds.some(roomExistId => roomExistId === roomId)

            if (!isRoom) {
                /* Insere a sala no banco */
                await db.run(`INSERT INTO rooms (
                    id,
                    pass
                ) VALUES (
                    ${parseInt(roomId)},
                    ${pass}
                )`)
            }    
        }
        
        await db.close()

        res.redirect(`/room/${roomId}`)
    },

    async open(req, res) {
        const db = await Database()
        const roomId = req.params.room
        const questions = await db.all(`SELECT * FROM questions WHERE room = ${roomId} and read = 0`)
        const questionsRead = await db.all(`SELECT * FROM questions WHERE room = ${roomId} and read = 1`) 
        let isNoQuestions

        if(questions.length == 0){
            if(questionsRead.length == 0){
                isNoQuestions = true
            }
        }
        
        res.render("room", {roomId: roomId, questions: questions, questionsRead: questionsRead, isNoQuestions: isNoQuestions})
    },


    /* Entra na sala */
    async enter(req, res){
        const roomId = Number(req.body.roomId)
        const db = await Database()
        const dbRooms = await db.all(`SELECT id FROM rooms`)

        // Converte em Array o Objeto gerado pelo Select e verifica se a sala digitada existe no BD
        const roonsArr = dbRooms.map(iten => iten.id)
        isRoom = roonsArr.some(isRoomExist => isRoomExist === roomId);
        await db.close()

        if(!isRoom) {
            return res.redirect('/')
        }

        res.redirect(`/room/${roomId}`)
    }
}