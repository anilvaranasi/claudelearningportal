import '@servicenow/sdk/global'

declare global {
    namespace Now {
        namespace Internal {
            interface Keys extends KeysRegistry {
                explicit: {
                    'aiux-color-swatch|claudelearningportal': {
                        table: 'sys_aix_color_swatch'
                        id: 'c22a35e72ef179c93ecd06fe7c7b02f1'
                    }
                    'aiux-experience-page-rel|x-ibmin-claudel-home-page': {
                        table: 'sys_aix_experience_page_rel'
                        id: '6746a1315bd4958993619a3ae7eb5807'
                    }
                    'aiux-experience-page-rel|x-ibmin-claudel-incidents-page': {
                        table: 'sys_aix_experience_page_rel'
                        id: 'ad9ccff9eedea5e70cadc204038a4708'
                    }
                    'aiux-experience-prop|appHeadCss': {
                        table: 'sys_aix_experience_properties'
                        id: 'b3145f78d9828428ee7b58c5d9263a50'
                    }
                    'aiux-experience-prop|appPlatform': {
                        table: 'sys_aix_experience_properties'
                        id: 'e7f76ebd99328ec6988b1ffda12a1ae8'
                    }
                    'aiux-experience-prop|appTailwindCss': {
                        table: 'sys_aix_experience_properties'
                        id: '968713663e012033b9b59b35b45ca558'
                    }
                    'aiux-experience|claudelearningportal': {
                        table: 'sys_aix_experience'
                        id: '705a90756d089ae666cd29d8c29fa8b0'
                    }
                    'aiux-layout-widget|lifecycle': {
                        table: 'sys_aix_widget'
                        id: '7ba90a0bca96529ca99c2fb10ee15b0d'
                    }
                    'aiux-page-widget|x-ibmin-claudel-home-page': {
                        table: 'sys_aix_widget'
                        id: '261bb65c69a995e8076850707353e494'
                    }
                    'aiux-page-widget|x-ibmin-claudel-incidents-page': {
                        table: 'sys_aix_widget'
                        id: '56a47c67bb134d69198c312a0631b4ac'
                    }
                    'aiux-page|x-ibmin-claudel-home-page': {
                        table: 'sys_aix_page'
                        id: '6b606cd2a6e6f7903b72848760fa560f'
                    }
                    'aiux-page|x-ibmin-claudel-incidents-page': {
                        table: 'sys_aix_page'
                        id: 'e190d03e8b6408064162e67251321a89'
                    }
                    'aiux-project|x_ibmin_claudel_claudelearningportal': {
                        table: 'sys_aix_project'
                        id: 'cc1ba035956134867d46987f9abc40fe'
                    }
                    'aiux-theme|claudelearningportal': {
                        table: 'sys_aix_theme'
                        id: 'abce3b749a5aa444161fcc231086aa71'
                    }
                    'aiux-widget|aiux-hello-world': {
                        table: 'sys_aix_widget'
                        id: '0ee2ca2013c2b62f87576048ae7e2d5d'
                    }
                    bom_json: {
                        table: 'sys_module'
                        id: '2fc81e55aaae445eab544393b9811800'
                    }
                    claude_api_key: {
                        table: 'sys_properties'
                        id: 'a42a92db4020406e9bd6f3cd1dc1d579'
                    }
                    package_json: {
                        table: 'sys_module'
                        id: '4e55531ce3bf47f69c115c765b0b4be5'
                    }
                    'sys-analytics-app|claudelearningportal': {
                        table: 'sys_analytics_app'
                        id: '92173cf497c51a48eaf50cfcb4ce2a12'
                    }
                }
                composite: [
                    {
                        table: 'sn_glider_source_artifact'
                        id: 'cf908dde09e340b78faeb0ffd0a3617b'
                        key: {
                            name: 'aiux-source cc1ba035956134867d46987f9abc40fe'
                        }
                    },
                    {
                        table: 'sn_glider_source_artifact_m2m'
                        id: 'de68a2d9c34548349bb324323557fd43'
                        key: {
                            application_file: 'cc1ba035956134867d46987f9abc40fe'
                            source_artifact: 'cf908dde09e340b78faeb0ffd0a3617b'
                        }
                    },
                ]
            }
        }
    }
}
