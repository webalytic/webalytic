import {
  QueryInterface, UUID, STRING, SMALLINT, BOOLEAN
} from 'sequelize'

const customDefinitionsTable = {
  schema: 'configuration',
  tableName: 'customDefinitions'
}

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable(
      customDefinitionsTable,
      {
        id: {
          type: UUID,
          primaryKey: true
        },
        resourceId: {
          type: UUID,
          allowNull: false
        },
        index: {
          type: SMALLINT,
          allowNull: false
        },
        type: {
          type: SMALLINT,
          allowNull: false
        },
        scope: {
          type: SMALLINT,
          allowNull: false
        },
        name: {
          type: STRING(64),
          allowNull: false
        },
        active: {
          type: BOOLEAN,
          allowNull: false
        }
      }
    )
  },
  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable(customDefinitionsTable as any)
  }
}
