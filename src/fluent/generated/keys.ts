import '@servicenow/sdk/global'

declare global {
    namespace Now {
        namespace Internal {
            interface Keys extends KeysRegistry {
                explicit: {
                    'aiux-color-swatch|claudelearningportal': {
                        table: 'sys_aix_color_swatch'
                        id: '76457c855f30f80dd6ee1066e635b65e'
                    }
                    'aiux-experience-page-rel|x-snc-claudelearni-home-page': {
                        table: 'sys_aix_experience_page_rel'
                        id: '0d4bb64b60e27ba17415f8dce62d523a'
                    }
                    'aiux-experience-page-rel|x-snc-claudelearni-incidents-page': {
                        table: 'sys_aix_experience_page_rel'
                        id: '5fe704187a849df1c3ffb3385e30363f'
                    }
                    'aiux-experience-prop|appHeadCss': {
                        table: 'sys_aix_experience_properties'
                        id: 'c2267ad7f8f8a7de42babe5df15cbeb2'
                    }
                    'aiux-experience-prop|appPlatform': {
                        table: 'sys_aix_experience_properties'
                        id: '03d4707f8051a4302e4f7bb916ebea4c'
                    }
                    'aiux-experience-prop|appTailwindCss': {
                        table: 'sys_aix_experience_properties'
                        id: '83fcd02462d7fdb6b011ce0da7d194d4'
                    }
                    'aiux-experience|claudelearningportal': {
                        table: 'sys_aix_experience'
                        id: 'a480ec76f8eb59f0567eec296d528941'
                    }
                    'aiux-layout-widget|lifecycle': {
                        table: 'sys_aix_widget'
                        id: '9ebfe18fc5b379937c985fd1bc1553f0'
                    }
                    'aiux-page-widget|x-snc-claudelearni-home-page': {
                        table: 'sys_aix_widget'
                        id: 'f73713ad2a1511e27ed3eb0ecf0db5f0'
                    }
                    'aiux-page-widget|x-snc-claudelearni-incidents-page': {
                        table: 'sys_aix_widget'
                        id: '002e0ab42c25216d2c3d91e0a3e80a1f'
                    }
                    'aiux-page|x-snc-claudelearni-home-page': {
                        table: 'sys_aix_page'
                        id: '79672b9a6d583b89811bea5100cdf49a'
                    }
                    'aiux-page|x-snc-claudelearni-incidents-page': {
                        table: 'sys_aix_page'
                        id: '6cf48aa298f65121e9a5b7823b51c91c'
                    }
                    'aiux-project|x_snc_claudelearni_claudelearningportal': {
                        table: 'sys_aix_project'
                        id: 'a8ecdc44900208a2891f74a7ef3e5c68'
                    }
                    'aiux-theme|claudelearningportal': {
                        table: 'sys_aix_theme'
                        id: 'd301de780fc4ed4bddd703ceb35f685c'
                    }
                    'aiux-widget|aiux-hello-world': {
                        table: 'sys_aix_widget'
                        id: '5a68f0431f80098291b56065a3515f58'
                    }
                    'aiux-widget|aiux-studio-preview': {
                        table: 'sys_aix_widget'
                        id: 'fd937f59b686be83b067a1fe3c6d9006'
                        deleted: true
                    }
                    bom_json: {
                        table: 'sys_module'
                        id: '5a3a88ac22364d8283d6c985d58477c0'
                    }
                    claude_api_key: {
                        table: 'sys_properties'
                        id: '5b1827560ada4224960b0cc036a3ce89'
                    }
                    package_json: {
                        table: 'sys_module'
                        id: '3abbb4abd69c443ebcb4a51b068971e3'
                    }
                    'sys-analytics-app|claudelearningportal': {
                        table: 'sys_analytics_app'
                        id: 'f07c6b24be3119ae9cbf91eb9ca31a5b'
                    }
                }
                composite: [
                    {
                        table: 'sn_glider_source_artifact'
                        id: '260bc949b7554c13a5a91a0416f93220'
                        key: {
                            name: 'aiux-source a8ecdc44900208a2891f74a7ef3e5c68'
                        }
                    },
                    {
                        table: 'sn_glider_source_artifact_m2m'
                        id: '5253b3d8c53b41c39379d0eae7682068'
                        key: {
                            application_file: 'a8ecdc44900208a2891f74a7ef3e5c68'
                            source_artifact: '260bc949b7554c13a5a91a0416f93220'
                        }
                    },
                ]
            }
        }
    }
}
