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
                    'aiux-page|x-ibmin-claudel-home-page': {
                        table: 'sys_aix_page'
                        id: '6b606cd2a6e6f7903b72848760fa560f'
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
                        id: '0487ed2a5459482ca86aa1be55552636'
                    }
                    claude_api_key: {
                        table: 'sys_properties'
                        id: '3b1f0494fbf94e19b49482ebb27fa1e0'
                    }
                    package_json: {
                        table: 'sys_module'
                        id: 'ef792a3853bf4b5692553e0ed074a8f0'
                    }
                    'sys-analytics-app|claudelearningportal': {
                        table: 'sys_analytics_app'
                        id: '92173cf497c51a48eaf50cfcb4ce2a12'
                    }
                }
                composite: [
                    {
                        table: 'sn_glider_source_artifact'
                        id: '4c66f33eefcf4d0d8e8eae6206effe67'
                        key: {
                            name: 'aiux-source cc1ba035956134867d46987f9abc40fe'
                        }
                    },
                    {
                        table: 'sn_glider_source_artifact_m2m'
                        id: '8e9a2c1e5a654720b9115be33ffa0aa4'
                        key: {
                            application_file: 'cc1ba035956134867d46987f9abc40fe'
                            source_artifact: '4c66f33eefcf4d0d8e8eae6206effe67'
                        }
                    },
                ]
            }
        }
    }
}
