/**
 * 数据表TypeScript类型生成器
 * 
 * 该脚本从tables目录读取表配置，生成对应的TypeScript类型定义
 * 方便在应用程序其他部分复用这些类型，保持类型定义的一致性
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// 在ES模块中获取当前文件的路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 允许的SQL类型列表
const ALLOWED_SQL_TYPES = [
  'TEXT', 
  'JSONB', 
  'TIMETZ', 
  'BIGINT', 
  'BIGSERIAL', 
  'TIMESTAMPTZ', 
  'DECIMAL', 
  'DATE',
  // 自动字段
  'ID',
  'CREATED_AT',
  'UPDATED_AT'
];

// SQL类型到TypeScript类型的映射
const SQL_TYPE_MAPPINGS: { [key: string]: string } = {
  'TEXT': 'TEXT',
  'JSONB': 'JSONB',
  'TIMETZ': 'TIMETZ',
  'BIGINT': 'BIGINT',
  'BIGSERIAL': 'BIGSERIAL',
  'TIMESTAMPTZ': 'TIMESTAMPTZ',
  'DECIMAL': 'DECIMAL',
  'DATE': 'DATE',
  // 特殊类型
  'ID': 'ID',
  'CREATED_AT': 'TIMESTAMPTZ',
  'UPDATED_AT': 'TIMESTAMPTZ'
};

// 导入表配置类型定义（与SQL生成器共用）
interface Field {
  name: string;
  type: string;
  length?: number;
  primary?: boolean;
  nullable?: boolean;
  default?: string | number | boolean | null;
  unique?: boolean;
  description?: string;
  check?: string;
  enumValues?: string[];
  enumName?: string;
  forceType?: string; // 允许手动指定TypeScript类型
}

interface Relation {
  targetTable: string;
  type: 'ONE_TO_ONE' | 'ONE_TO_MANY' | 'MANY_TO_ONE' | 'MANY_TO_MANY';
  relationNameInCurrentTable: string;
  relationNameInTargetTable: string;
  onDelete?: string;
  onUpdate?: string;
  description?: string;
}

interface TableConfig {
  tableName: string;
  description?: string;
  fields: Field[];
  relations?: Relation[];
}

// 用于存储反向关系的结构
interface ReverseRelation {
  sourceTable: string;
  targetTable: string;
  type: 'ONE_TO_ONE' | 'ONE_TO_MANY' | 'MANY_TO_ONE' | 'MANY_TO_MANY';
  relationNameInSourceTable: string;
  relationNameInTargetTable: string;
  description?: string;
  foreignKeyColumn?: string;
}

// 辅助函数：提取基本类型（如 TEXT(100) -> TEXT）
function extractBaseType(type: string): string {
  // 移除数组标记
  if (type.endsWith('[]')) {
    return 'ARRAY';
  }
  
  // 处理带参数的类型，如 VARCHAR(255)
  const match = type.match(/^([A-Z_]+)(?:\(.*\))?$/i);
  return match ? match[1].toUpperCase() : type.toUpperCase();
}

// SQL类型到TypeScript类型的映射
const mapSqlToTypeScriptType = (field: Field): string => {
  // 如果指定了强制类型，直接使用
  if (field.forceType) {
    return field.forceType;
  }
  
  const type = extractBaseType(field.type);
  const mappedType = SQL_TYPE_MAPPINGS[type];
  
  // 特殊处理外键字段（以_id结尾）
  if (field.name.endsWith('_id') && (type === 'BIGINT' || type === 'BIGSERIAL')) {
    return 'ForeignKey';
  }
  
  // 特殊处理id字段
  if (field.name === 'id' && (type === 'BIGINT' || type === 'BIGSERIAL')) {
    return 'ID';
  }
  
  // 处理时间戳字段
  if ((field.name === 'created_at' || field.name === 'updated_at') && type === 'TIMESTAMPTZ') {
    return 'TIMESTAMPTZ';
  }
  
  // 处理数组类型
  if (field.type.endsWith('[]')) {
    return `${mappedType}[]`;
  }
  
  return mappedType || `unknown /* ${type} */`;
};

// 加载所有表配置
async function loadAllTables(): Promise<TableConfig[]> {
  const tablesDir = path.join(__dirname, 'tables');
  const tables: TableConfig[] = [];

  try {
    // 读取tables目录下的所有文件
    const files = fs.readdirSync(tablesDir);

    // 加载每个文件
    for (const file of files) {
      if (file.endsWith('.ts') || file.endsWith('.js')) {
        const filePath = path.join(tablesDir, file);
        try {
          // 动态导入表定义
          const importedModule = await import(`file://${filePath}`);
          const tableConfig = importedModule.default;

          if (tableConfig && tableConfig.tableName && tableConfig.fields) {
            tables.push(tableConfig);
          } else {
            console.warn(`警告：文件 ${file} 不包含有效的表配置`);
          }
        } catch (err) {
          console.error(`加载文件 ${file} 时出错：`, err);
        }
      }
    }
  } catch (err) {
    console.error('读取tables目录时出错：', err);
  }

  return tables;
}

// 计算双向关系
function calculateReverseRelations(tables: TableConfig[]): Map<string, ReverseRelation[]> {
  const reverseRelations = new Map<string, ReverseRelation[]>();
  
  // 初始化每个表的空关系数组
  tables.forEach(table => {
    reverseRelations.set(table.tableName, []);
  });
  
  // 遍历所有表的关系，为目标表添加反向关系
  tables.forEach(sourceTable => {
    if (!sourceTable.relations) return;
    
    sourceTable.relations.forEach(relation => {
      const targetTableName = relation.targetTable;
      const targetTableRelations = reverseRelations.get(targetTableName) || [];
      
      // 计算反向关系类型
      let reverseType: 'ONE_TO_ONE' | 'ONE_TO_MANY' | 'MANY_TO_ONE' | 'MANY_TO_MANY';
      switch (relation.type) {
        case 'ONE_TO_ONE':
          reverseType = 'ONE_TO_ONE';
          break;
        case 'ONE_TO_MANY':
          reverseType = 'MANY_TO_ONE';
          break;
        case 'MANY_TO_ONE':
          reverseType = 'ONE_TO_MANY';
          break;
        case 'MANY_TO_MANY':
          reverseType = 'MANY_TO_MANY';
          break;
      }
      
      // 添加反向关系
      targetTableRelations.push({
        sourceTable: sourceTable.tableName,
        targetTable: targetTableName,
        type: reverseType,
        relationNameInSourceTable: relation.relationNameInCurrentTable,
        relationNameInTargetTable: relation.relationNameInTargetTable,
        description: `引用自 ${sourceTable.tableName} 表`,
        foreignKeyColumn: 
          (reverseType === 'MANY_TO_ONE' || reverseType === 'ONE_TO_ONE') ? 
            `${relation.relationNameInTargetTable}_${sourceTable.tableName}` : 
            undefined
      });
      
      reverseRelations.set(targetTableName, targetTableRelations);
    });
  });
  
  return reverseRelations;
}

// 验证字段类型是否在允许的类型列表中
function validateFieldTypes(tables: TableConfig[]): { table: string, field: string, type: string }[] {
  const errors: { table: string, field: string, type: string }[] = [];
  
  for (const table of tables) {
    for (const field of table.fields) {
      const upperCaseType = extractBaseType(field.type);
      if (!ALLOWED_SQL_TYPES.includes(upperCaseType)) {
        errors.push({
          table: table.tableName,
          field: field.name,
          type: field.type
        });
      }
    }
  }
  
  return errors;
}

// 生成TypeScript类型定义
export function generateTypes(tables: TableConfig[], reverseRelations: Map<string, ReverseRelation[]>): string {
  let output = '';
  
  // 添加文件头
  output += '/**\n';
  output += ' * 数据库表对应的TypeScript类型定义\n';
  output += ' * 注意：此文件由生成器自动生成，请勿手动修改\n';
  output += ` * 生成时间：${new Date().toISOString()}\n`;
  output += ' */\n\n';
  
  // 添加通用类型定义
  output += '// 通用类型定义 - SQL类型映射\n';
  output += '// PostgreSQL数据类型对应的TypeScript类型\n';
  output += 'export type BIGSERIAL = number | string;\n';
  output += 'export type BIGINT = number | string;\n';
  output += 'export type TEXT = string;\n';
  output += 'export type JSONB = Record<string, unknown>;\n';
  output += 'export type TIMESTAMPTZ = number | string;\n';
  output += 'export type TIMETZ = string;\n';
  output += 'export type DECIMAL = string | number;\n';
  output += 'export type DATE = string | Date;\n\n';
  
  output += '// 业务类型定义\n';
  output += 'export type ID = BIGSERIAL;\n';
  output += 'export type ForeignKey = BIGINT | null;\n\n';
  
  output += '// 类型定义\n\n';
  
  // 为每个表生成接口
  for (const table of tables) {
    output += generateTableInterface(table, reverseRelations);
    output += '\n';
  }
  
  // 生成类型导出索引
  output += '// 导出类型\n';
  output += `export type TableNames = ${tables.map(t => `'${t.tableName}'`).join(' | ')};\n\n`;
  
  // 生成获取表类型的工具类型
  output += `/**
 * 获取指定表的类型
 * @example
 * type UserRow = TableType<'user'>;
 */
export type TableType<T extends TableNames> = 
${tables.map(t => `  T extends '${t.tableName}' ? ${pascalCase(t.tableName)} :`).join('\n')}
  never;
`;
  
  return output;
}

// 为表生成TypeScript接口
function generateTableInterface(
  table: TableConfig, 
  reverseRelations: Map<string, ReverseRelation[]>
): string {
  let output = '';
  
  // 添加注释
  if (table.description) {
    output += `/**\n * ${table.description}\n */\n`;
  } else {
    output += `/**\n * ${table.tableName} 表的类型定义\n */\n`;
  }
  
  // 生成接口定义
  output += `export interface ${pascalCase(table.tableName)} {\n`;
  
  // 添加每个字段
  for (const field of table.fields) {
    // 添加字段注释
    if (field.description) {
      output += `  /** ${field.description} */\n`;
    }
    
    // 生成字段类型
    const tsType = mapSqlToTypeScriptType(field);
    const isOptional = field.nullable !== false && !field.primary;
    
    output += `  ${field.name}${isOptional ? '?' : ''}: ${tsType}${isOptional ? ' | null' : ''};\n`;
  }
  
  // 添加标准字段（如果在interface内不想列出来，可以删除这部分）
  output += `  /** 唯一标识符 */\n`;
  output += `  id?: ID;\n`; 
  output += `  /** 创建时间 */\n`;
  output += `  created_at?: TIMESTAMPTZ;\n`;
  output += `  /** 更新时间 */\n`;
  output += `  updated_at?: TIMESTAMPTZ;\n`;
  
  const tableReverseRelations = reverseRelations.get(table.tableName) || [];
  const hasRelations = (table.relations && table.relations.length > 0) || 
                      (tableReverseRelations.length > 0);
  
  // 对于关系字段，添加关联对象
  if (hasRelations) {
    output += '\n  // 关联关系\n';
    
    // 添加外键字段
    tableReverseRelations.forEach(relation => {
      if (relation.foreignKeyColumn) {
        output += `  /** 外键：关联到 ${relation.sourceTable} 表 */\n`;
        output += `  ${relation.foreignKeyColumn}?: ForeignKey;\n\n`;
      }
    });
    
    // 添加直接关系（在当前表中定义的）
    if (table.relations) {
      for (const relation of table.relations) {
        const targetType = pascalCase(relation.targetTable);
        
        if (relation.description) {
          output += `  /** ${relation.description} */\n`;
        }
        
        if (relation.type === 'ONE_TO_MANY') {
          output += `  ${relation.relationNameInCurrentTable}?: ${targetType}[];\n`;
        } else if (relation.type === 'ONE_TO_ONE' || relation.type === 'MANY_TO_ONE') {
          output += `  ${relation.relationNameInCurrentTable}?: ${targetType} | null;\n`;
        } else if (relation.type === 'MANY_TO_MANY') {
          output += `  ${relation.relationNameInCurrentTable}?: ${targetType}[];\n`;
        }
      }
    }
    
    // 添加反向关系（其他表指向当前表的）
    for (const reverseRelation of tableReverseRelations) {
      const sourceType = pascalCase(reverseRelation.sourceTable);
      const relationName = reverseRelation.relationNameInTargetTable;
      
      if (relationName) {  // 只有在目标表中有命名的关系才添加
        output += `  /** ${reverseRelation.description || `关联到 ${reverseRelation.sourceTable} 表`} */\n`;
        
        if (reverseRelation.type === 'ONE_TO_MANY') {
          output += `  ${relationName}?: ${sourceType}[];\n`;
        } else if (reverseRelation.type === 'ONE_TO_ONE' || reverseRelation.type === 'MANY_TO_ONE') {
          output += `  ${relationName}?: ${sourceType} | null;\n`;
        } else if (reverseRelation.type === 'MANY_TO_MANY') {
          output += `  ${relationName}?: ${sourceType}[];\n`;
        }
      }
    }
  }
  
  output += '}\n\n';
  
  return output;
}

// 辅助函数：转换为Pascal命名（首字母大写）
function pascalCase(str: string): string {
  // 处理特殊情况，如果表名是"user"，转换为"User"
  if (str === 'user') return 'User';
  
  return str
    .split('_')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

// 生成类型定义索引文件
async function generateTypeDefinitions(): Promise<void> {
  try {
    // 加载所有表配置
    const tables = await loadAllTables();
    console.log(`加载了 ${tables.length} 个表定义`);
    
    // 验证字段类型
    const typeErrors = validateFieldTypes(tables);
    if (typeErrors.length > 0) {
      console.error('错误: 检测到不支持的字段类型，类型生成已中止');
      console.error('以下字段类型不在允许的类型列表中:');
      for (const error of typeErrors) {
        console.error(`- 表 "${error.table}" 中的字段 "${error.field}" 使用了不支持的类型: "${error.type}"`);
      }
      console.error(`\n允许的类型有: ${ALLOWED_SQL_TYPES.join(', ')}`);
      return;
    }
    
    // 计算表之间的关系
    const reverseRelations = calculateReverseRelations(tables);
    
    // 生成类型定义文本
    const output = generateTypes(tables, reverseRelations);
    
    // 写入文件
    const outputDir = path.join(__dirname, 'types');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const outputFile = path.join(outputDir, 'index.ts');
    fs.writeFileSync(outputFile, output);
    
    console.log(`成功生成类型定义文件：${outputFile}`);
  } catch (error) {
    console.error('生成类型定义时出错:', error);
  }
}

// 执行生成
generateTypeDefinitions();

// 导出函数，允许从其他文件调用
export { generateTypeDefinitions };
