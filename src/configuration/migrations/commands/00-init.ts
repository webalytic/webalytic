import {
  QueryInterface, UUID, STRING, SMALLINT
} from 'sequelize'

const resourcesTable = {
  schema: 'configuration',
  tableName: 'resources'
}

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable(
      resourcesTable,
      {
        id: {
          type: UUID,
          primaryKey: true
        },
        name: {
          type: STRING(64),
          allowNull: false
        },
        category: {
          type: SMALLINT(),
          allowNull: false
        },
        defaultWebsiteUrl: {
          type: STRING(512),
          allowNull: false
        },
        createTime: {
          type: 'TIMESTAMP',
          allowNull: false
        },
        updateTime: {
          type: 'TIMESTAMP',
          allowNull: true
        }
      }
    )
  },
  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable(resourcesTable as any)
  }
}
