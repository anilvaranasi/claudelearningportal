import '@servicenow/sdk/global'

declare global {
    namespace Now {
        namespace Internal {
            interface Keys extends KeysRegistry {
                explicit: {
                    'aiux-color-swatch|claudelearningportal': {
                        table: 'sys_aix_color_swatch'
                        id: 'b74df7f405911ee910e037d21b87a798'
                    }
                    'aiux-experience-page-rel|x-146833-claudel-home-page': {
                        table: 'sys_aix_experience_page_rel'
                        id: 'e47d16de2cbed0f415ca55fb7387154d'
                    }
                    'aiux-experience-page-rel|x-146833-claudel-incidents-page': {
                        table: 'sys_aix_experience_page_rel'
                        id: 'a4c2a8c4dd47851479fbf676f4fb5d66'
                    }
                    'aiux-experience-prop|appHeadCss': {
                        table: 'sys_aix_experience_properties'
                        id: '575b19f2b1cd67d418aca6b7a53df77a'
                    }
                    'aiux-experience-prop|appPlatform': {
                        table: 'sys_aix_experience_properties'
                        id: '6f35ab2380a917c4be028b11a6ce253d'
                    }
                    'aiux-experience-prop|appTailwindCss': {
                        table: 'sys_aix_experience_properties'
                        id: 'a1dffd6f2d9298136074ba352b23a1fc'
                    }
                    'aiux-experience|claudelearningportal': {
                        table: 'sys_aix_experience'
                        id: '70961d51f3d6767e24089b4314b69544'
                    }
                    'aiux-layout-widget|lifecycle': {
                        table: 'sys_aix_widget'
                        id: '850aaa1feed143330757cd64005a859c'
                    }
                    'aiux-page-widget|x-146833-claudel-home-page': {
                        table: 'sys_aix_widget'
                        id: 'd7d2fcfd3d2582b5d4e5b68984c439b1'
                    }
                    'aiux-page-widget|x-146833-claudel-incidents-page': {
                        table: 'sys_aix_widget'
                        id: '538a745cf4a5f379fabceb0707b33872'
                    }
                    'aiux-page|x-146833-claudel-home-page': {
                        table: 'sys_aix_page'
                        id: '289a7f45b2603dafef01b8168ae49f39'
                    }
                    'aiux-page|x-146833-claudel-incidents-page': {
                        table: 'sys_aix_page'
                        id: '638e223bff5fced2698fc0057dae2cdf'
                    }
                    'aiux-project|x_146833_claudel_claudelearningportal': {
                        table: 'sys_aix_project'
                        id: 'e0cc3fbda704c155824956f6a2c998e2'
                    }
                    'aiux-theme|claudelearningportal': {
                        table: 'sys_aix_theme'
                        id: '1e17d6edd3bc13e4521d827ecc0064ad'
                    }
                    'aiux-widget|aiux-hello-world': {
                        table: 'sys_aix_widget'
                        id: 'f1ecb1fbd0e9036f6031744e4e0a39c1'
                    }
                    'aiux-widget|aiux-studio-preview': {
                        table: 'sys_aix_widget'
                        id: '2d3ac791de2175f3620a5db8ecbf77fb'
                        deleted: true
                    }
                    bom_json: {
                        table: 'sys_module'
                        id: '4cc91e1b4df04485942d397e6e613610'
                    }
                    claude_api_key: {
                        table: 'sys_properties'
                        id: 'aebe552c1fcb441dbc2f1bc804a6d3d1'
                    }
                    package_json: {
                        table: 'sys_module'
                        id: '4203b43986ed479ebc130aecf70bbf3f'
                    }
                    'sys-analytics-app|claudelearningportal': {
                        table: 'sys_analytics_app'
                        id: 'ac662a6d2443d4e76775f5b2b6ef75a4'
                    }
                }
                composite: [
                    {
                        table: 'sn_glider_source_artifact_m2m'
                        id: '1a8f127f74a74811a73cd351ea0a7c16'
                        key: {
                            application_file: 'e0cc3fbda704c155824956f6a2c998e2'
                            source_artifact: 'd172d357065c43279ea4f301dfde253d'
                        }
                    },
                    {
                        table: 'sn_glider_source_artifact'
                        id: 'd172d357065c43279ea4f301dfde253d'
                        key: {
                            name: 'aiux-source e0cc3fbda704c155824956f6a2c998e2'
                        }
                    },
                ]
            }
        }
    }
}
