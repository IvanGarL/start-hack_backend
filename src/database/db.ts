import { Connection, createConnection, EntityManager, getConnectionManager } from 'typeorm';
import config from '../../ormconfig';

export const getConnection = async (): Promise<EntityManager> => {
    const connectionManager = getConnectionManager();
    let connection: Connection;

    if (connectionManager.has(config.name)) {
        connection = connectionManager.get(config.name);
    } else {
        console.log("else")
        connection = await createConnection(config);
    }
    if (!connection.isConnected) await connection.connect();

    console.log("done")
    return connection.manager;
};
