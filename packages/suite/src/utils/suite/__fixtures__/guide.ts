import { Page, Category } from '@suite/types/suite/guide';

const { getGuideNode } = global.JestMocks;

const GUIDE_PAGE_NODE = getGuideNode('page') as Page;
const GUIDE_CATEGORY_NODE = getGuideNode('category') as Category;
const GUIDE_CATEGORY_NODE_CHILD = GUIDE_CATEGORY_NODE.children.find(
    x => x.id === '/security',
) as Category;

export const getNodeTitle = [
    {
        description: 'existing title',
        input: {
            node: GUIDE_PAGE_NODE,
            language: 'en',
        },
        result: 'Locktime',
    },
    {
        description: 'missing title',
        input: {
            node: GUIDE_PAGE_NODE,
            language: 'cz',
        },
        result: 'Locktime',
    },
];

export const getNodeById = [
    {
        description: 'root node: Page',
        input: {
            node: getGuideNode('page', '/') as Page,
            id: '/',
        },
        result: getGuideNode('page', '/') as Page,
    },
    {
        description: 'root node: Category',
        input: {
            node: GUIDE_CATEGORY_NODE,
            id: '/',
        },
        result: GUIDE_CATEGORY_NODE,
    },
    {
        description: 'child node: Category',
        input: {
            node: GUIDE_CATEGORY_NODE,
            id: '/security',
        },
        result: GUIDE_CATEGORY_NODE.children.find(x => x.id === '/security'),
    },
    {
        description: 'child node: Page',
        input: {
            node: GUIDE_CATEGORY_NODE,
            id: '/suite-basics/send/locktime.md',
        },
        result: undefined,
    },
];

export const getAncestorIds = [
    {
        description: 'ids of ancestors of given node id by length: 2',
        input: {
            id: '/cryptocurrencies/ethereum',
        },
        result: ['/', '/cryptocurrencies'],
    },
    {
        description: 'ids of ancestors of given node id by length: 3',
        input: {
            id: '/suite-basics/send/locktime',
        },
        result: ['/', '/suite-basics', '/suite-basics/send'],
    },
];

export const findAncestorNodes = [
    {
        description: 'ancestors nodes for node',
        input: {
            node: GUIDE_CATEGORY_NODE_CHILD.children.find(
                x => x.id === '/security/suite-basics',
            ) as Category,
            root: GUIDE_CATEGORY_NODE,
        },
        result: [
            {
                children: [
                    {
                        children: [
                            {
                                children: [],
                                id: '/security/suite-basics/send',
                                locales: ['en'],
                                title: {
                                    en: 'Send',
                                },
                                type: 'category',
                            },
                        ],
                        id: '/security/suite-basics',
                        locales: ['en'],
                        title: {
                            en: 'Suite basics',
                        },
                        type: 'category',
                    },
                ],
                id: '/security',
                locales: ['en'],
                title: {
                    en: 'Security',
                },
                type: 'category',
            },
        ],
    },
];
