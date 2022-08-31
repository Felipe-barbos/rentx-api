import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateCategories1660484857476 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        //criando a tabela na BD
        await queryRunner.createTable(
            new Table({
                name: "categories",
                columns:[
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true
                    },
                    {
                        name:"name",
                        type: "varchar",

                    },
                    {
                        name: "description",
                        type: "varchar",
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "now()",
                    },
                ],
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        //caso dê algum erro a tabela será excluida
        await queryRunner.dropTable("categories");
    }

}
