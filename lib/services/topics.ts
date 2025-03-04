import { ezClient } from "@/lib/tools/ezclient";
import { Topics as Topic } from "@/dataModel/types";

export async function autocompleteTopicIdsByNames(names: string[]) {
    const topics = await ezClient.query({
        name: 'topics',
        args: {
            name: {
                _in: names.filter(name => name != '')
            },

        },
        fields: ['id', 'name']
    });
    // 筛选出没有查到name的话题
    const notFoundNames = names.filter(name => !topics.some((topic: Topic) => topic.name === name));

    // 创建没有查到name的话题
    const { returning: createdTopics } = await ezClient.mutation({
        name: 'insert_topics',
        args: {
            objects: notFoundNames.map(name => ({ name }))
        },
        fields: {
            name: "returning",
            fields: ['id', 'name']
        }
    });
    // 合并创建的话题
    const allTopics: Topic[] = [...topics, ...createdTopics];
    return allTopics;
}