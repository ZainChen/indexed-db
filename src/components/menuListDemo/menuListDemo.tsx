import React, { Component } from 'react';
import { MenuList, MenuListItem } from 'zain-ui';
import './menuListDemo.less';

/**
 * 菜单列表组件测试
 */
export class MenuListDemo extends Component {
    /**
     * 菜单栏文件菜单
     */
    getFileMenuListItem(): MenuListItem[] {
        return [
            { key: '1', leftText: 'New File', rightText: 'Ctrl+N' },
            { key: '2', leftText: 'New Window', rightText: 'Ctrl+Shift+N' },
            { splitLine: true },
            { key: '3', leftText: 'Open File...', rightText: 'Ctrl+O' },
            { key: '4', leftText: 'Open Folder...', rightText: 'Ctrl+K Ctrl+O' },
            {
                key: '5',
                leftText: 'Open Recent',
                menuListItems: [
                    {
                        key: '5-1',
                        leftText: 'Reopen Closed Editor',
                        rightText: 'Ctrl+Shift+T',
                        menuListItems: [
                            { key: '5-1-1', leftText: 'Reopen Closed Editor', rightText: 'Ctrl+Shift+T' },
                            { splitLine: true },
                            { key: '5-1-2', leftText: 'D:\\Documents\\Git\\Zain\\zainote' },
                            { key: '5-1-3', leftText: 'D:\\Documents\\Git\\Zain\\zainote.github.io' },
                            { key: '5-1-4', leftText: 'D:\\Documents\\Git\\Zain\\vscode' },
                            { splitLine: true },
                            { key: '5-1-5', leftText: 'More...', rightText: 'Ctrl+R' },
                            { splitLine: true },
                            { key: '5-1-6', leftText: 'Clear Recently Opened' }
                        ]
                    },
                    { splitLine: true },
                    { key: '5-2', leftText: 'D:\\Documents\\Git\\Zain\\zainote' },
                    { key: '5-3', leftText: 'D:\\Documents\\Git\\Zain\\zainote.github.io' },
                    { key: '5-4', leftText: 'D:\\Documents\\Git\\Zain\\vscode' },
                    { splitLine: true },
                    { key: '5-5', leftText: 'More...', rightText: 'Ctrl+R' },
                    { splitLine: true },
                    { key: '5-6', leftText: 'Clear Recently Opened' }
                ]
            },
            { splitLine: true },
            { key: '6', leftText: 'Save', rightText: 'Ctrl+S' },
            { key: '7', leftText: 'Save As...', rightText: 'Ctrl+Shift+S' }
        ];
    }

    handleClickFileMenu(menuListItemReturn: MenuListItem): void {
        console.log('zain>>>>>menuListItemReturn', menuListItemReturn)
    }

    render(): JSX.Element {
        return (
            <div className="ZuiMenuList-test-root">
                <MenuList
                    menuListItems={this.getFileMenuListItem()}
                    onClickMenuListItem={(menuListItemReturn: MenuListItem) => { this.handleClickFileMenu(menuListItemReturn); }}
                >MenuList</MenuList>
            </div>
        );
    }
}
