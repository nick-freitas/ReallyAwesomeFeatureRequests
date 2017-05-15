import {expect} from 'chai';

import {iocContainer, initializeBindings} from '../config/inversify.config';
import {App} from "../app";
import {iocTypes} from "../ioc-types";
import {Routes} from "../routes/routes";
import {DbConnector} from "../db-connector";
import {Server} from "../server";

describe(`Client integration`, () => {
    let request = null;

    before(async () => {
        initializeBindings();

        const dbConnector = iocContainer.get<DbConnector>(iocTypes.DbConnector);
        const server = iocContainer.get<Server>(iocTypes.Server);
        const route = iocContainer.get<Routes>(iocTypes.Routes);
        const app = new App(dbConnector, server, route);
        await app.initializeApp();

        request = require('supertest')(app.server.server.listener);
    });

    it('gets all clients', async () => {
        let response: any = await new Promise((resolve, reject) => {
            request.get(`/api/clients`)
                .end((err, res) => {
                    if (err) {
                        return reject(err);
                    }

                    resolve(res);
                });
        });

        expect(response.status).to.equal(200);
        expect(response.body).to.be.ok;
        expect(response.body).to.be.instanceof(Array);
        expect(response.body).to.not.be.empty;
    });

    it('gets a single client', async () => {
        const clientId = 2;
        const clientName = "Client B";

        let response: any = await new Promise((resolve, reject) => {
            request.get(`/api/clients/${clientId}`)
                .end((err, res) => {
                    if (err) {
                        return reject(err);
                    }

                    resolve(res);
                });
        });

        expect(response.status, `Status is not 200`).to.equal(200);
        expect(response.body, `Body is not ok`).to.be.ok;
        expect(response.body.id, `Id is not ok`).to.be.ok;
        expect(response.body.id, `Id is not ${clientId}`).to.equal(clientId);
        expect(response.body.name, `Name is not ok`).to.be.ok;
        expect(response.body.name, `Name is not ${clientName}`).to.equal(clientName);
    });

    it('creates a client', async () => {
        const clientName = `Client D - ${new Date().getMilliseconds()}`;

        let response: any = await new Promise((resolve, reject) => {
            request.post(`/api/clients`)
                .send({
                    name: clientName
                })
                .set('Accept', 'application/json')
                .end((err, res) => {
                    if (err) {
                        return reject(err);
                    }

                    resolve(res);
                });
        });

        expect(response.status, `Status is not 201`).to.equal(201);
        expect(response.body, `Body is not ok`).to.be.ok;
        expect(response.body.id, `Id is not ok`).to.be.ok;
        expect(response.body.name, `Name is not ok`).to.be.ok;
        expect(response.body.name, `Name is not ${clientName}`).to.equal(clientName);

        const clientId = response.body.id;

        response = await new Promise((resolve, reject) => {
            request.get(`/api/clients/${clientId}`)
                .end((err, res) => {
                    if (err) {
                        return reject(err);
                    }

                    resolve(res);
                });
        });

        expect(response.status, `Status is not 200`).to.equal(200);
        expect(response.body, `Body is not ok`).to.be.ok;
        expect(response.body.id, `Id is not ok`).to.be.ok;
        expect(response.body.id, `Id is not ${clientId}`).to.equal(clientId);
        expect(response.body.name, `Name is not ok`).to.be.ok;
        expect(response.body.name, `Name is not ${clientName}`).to.equal(clientName);
    });

    it('updates a client', async () => {
        const clientId = 1;
        const newClientName = `Client E - ${new Date().getMilliseconds()}`;

        let response: any = await new Promise((resolve, reject) => {
            request.put(`/api/clients/${clientId}`)
                .send({
                    name: newClientName
                })
                .set('Accept', 'application/json')
                .end((err, res) => {
                    if (err) {
                        return reject(err);
                    }

                    resolve(res);
                });
        });

        expect(response.status, `Status is not 200`).to.equal(200);
        expect(response.body, `Body is not ok`).to.be.ok;
        expect(response.body.id, `Id is not ok`).to.be.ok;
        expect(response.body.id, `Id is not ${clientId}`).to.equal(clientId);
        expect(response.body.name, `Name is not ok`).to.be.ok;
        expect(response.body.name, `Name is not ${newClientName}`).to.equal(newClientName);

        response = await new Promise((resolve, reject) => {
            request.get(`/api/clients/${clientId}`)
                .end((err, res) => {
                    if (err) {
                        return reject(err);
                    }

                    resolve(res);
                });
        });

        expect(response.status, `Status is not 200`).to.equal(200);
        expect(response.body, `Body is not ok`).to.be.ok;
        expect(response.body.id, `Id is not ok`).to.be.ok;
        expect(response.body.id, `Id is not ${clientId}`).to.equal(clientId);
        expect(response.body.name, `Name is not ok`).to.be.ok;
        expect(response.body.name, `Name is not ${newClientName}`).to.equal(newClientName);
    });

    it('delete a client', async () => {
        let response: any = await new Promise((resolve, reject) => {
            request.post(`/api/clients`)
                .send({
                    name: `Client F - ${new Date().getMilliseconds()}`
                })
                .set('Accept', 'application/json')
                .end((err, res) => {
                    if (err) {
                        return reject(err);
                    }

                    resolve(res);
                });
        });

        const clientId = response.body.id;

        response = await new Promise((resolve, reject) => {
            request.delete(`/api/clients/${clientId}`)
                .end((err, res) => {
                    if (err) {
                        return reject(err);
                    }

                    resolve(res);
                });
        });

        expect(response.status, `Status is not 200`).to.equal(200);
        expect(response.body, `Body is not ok`).to.be.ok;

        response = await new Promise((resolve, reject) => {
            request.get(`/api/clients/${clientId}`)
                .end((err, res) => {
                    if (err) {
                        return reject(err);
                    }

                    resolve(res);
                });
        });

        expect(response.status, `Response is not 404`).to.equal(404);
    });

    it('fails to update a client because there is no name', async () => {
        const clientId = 1;

        let response: any = await new Promise((resolve, reject) => {
            request.put(`/api/clients/${clientId}`)
                .end((err, res) => {
                    if (err) {
                        return reject(err);
                    }

                    resolve(res);
                });
        });

        expect(response.status, `Status is not 400`).to.equal(400);
    });

    it('fails to create a client because there is no name', async () => {
        let response: any = await new Promise((resolve, reject) => {
            request.post(`/api/clients`)
                .end((err, res) => {
                    if (err) {
                        return reject(err);
                    }

                    resolve(res);
                });
        });

        expect(response.status, `Status is not 400`).to.equal(400);
    });

    it('fails to get one because id is bad', async () => {
        const response: any = await new Promise((resolve, reject) => {
            request.get(`/api/clients/undefined`)
                .end((err, res) => {
                    if (err) {
                        return reject(err);
                    }

                    resolve(res);
                });
        });

        expect(response.status, `Status is not 400`).to.equal(400);
    });

    it('fails to delete because id is bad', async () => {
        const response: any = await new Promise((resolve, reject) => {
            request.delete(`/api/clients/undefined`)
                .end((err, res) => {
                    if (err) {
                        return reject(err);
                    }

                    resolve(res);
                });
        });

        expect(response.status, `Status is not 400`).to.equal(400);
    });
});
