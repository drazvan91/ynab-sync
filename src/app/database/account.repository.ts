import { Injectable } from '@angular/core';

import { Plugins } from '@capacitor/core';
import { DatabaseProvider } from './database.provider';
import { AccountModel } from './models';

const { Storage } = Plugins;

@Injectable()
export class AccountRepository {

  private STORAGE_KEY = 'ACCOUNTS';
  constructor(private dbProvider: DatabaseProvider
    ) {
  }

  public async getAll$(){
    return await this.dbProvider.get().accounts.find().$;
  }

  public async getAll(): Promise<AccountModel[]> {
    const a = await this.dbProvider.get().accounts.find().exec();
    
    return a.map(doc => {
      return {
        id: doc.id,
        name: doc.name,
        mappedNames: doc.mappedNames
      }
    })
  }

  public async assignRawAccount(rawAccountName: string, accountId: string) {
    const assigned = await this.dbProvider.get().accounts.find({
      "selector":{
        "mappedNames":{
          "$elemMatch": rawAccountName
        }
      }
    }).exec();

    for(const account of assigned){
      await account.update({
        "$set":{
          mappedNames: account.mappedNames.filter(n=>n!== rawAccountName)
        }
      })
    }

    const newAssigned = await this.dbProvider.get().accounts.findOne(accountId).exec();
    await newAssigned.update({
      "$set": {
        mappedNames: [...newAssigned.mappedNames, rawAccountName]
      }
    });

  }

  public async syncAccounts(accounts: AccountModel[]) {
    const accountIds = accounts.map(a=>a.id);

    await this.dbProvider.get().accounts.find().where("id").nin(accountIds).remove();

    const existingAccounts = await this.dbProvider.get().accounts.find().exec();
    for(const account of accounts){
      const existing = existingAccounts.find(a=>a.id === account.id);
      if(!existing){
        await this.dbProvider.get().accounts.insert({
          id: account.id,
          name: account.name,
          mappedNames: []
        })
      } else {
        if(existing.name !== account.name){
          existing.update({
            "$set":{
              name: account.name
            }
          })
        }
      }
    }
  }
}
