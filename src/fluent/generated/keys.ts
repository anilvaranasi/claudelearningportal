import '@servicenow/sdk/global'

declare global {
    namespace Now {
        namespace Internal {
            interface Keys extends KeysRegistry {
                explicit: {
                    'aiux-acl|aiux-claude-status|read|status-admin': {
                        table: 'sys_security_acl'
                        id: 'b6a252b903e84d3496908f038cc4b76b'
                    }
                    'aiux-acl|aiux-claude-status|read|status-experience-admin': {
                        table: 'sys_security_acl'
                        id: '31d50bcbd89f44b0ad0ad3f3e0d08dce'
                    }
                    'aiux-acl|aiux-otto-search|read|search-admin': {
                        table: 'sys_security_acl'
                        id: '66b4475ed4904e229c4c21d23416d619'
                    }
                    'aiux-acl|aiux-otto-search|read|search-experience-admin': {
                        table: 'sys_security_acl'
                        id: 'c35d2faf8d2046f3945013964d2272d5'
                    }
                    'aiux-acl|aiux-otto-search|read|search-user': {
                        table: 'sys_security_acl'
                        id: 'aa9b6f0f76a44e959588a03a68ff0ce7'
                    }
                    'aiux-acl|experience:claudelearningportal|read|app-admin': {
                        table: 'sys_security_acl'
                        id: '49a93f7bdb304e46b9fd937a662f22ee'
                    }
                    'aiux-acl|experience:claudelearningportal|read|app-experience-admin': {
                        table: 'sys_security_acl'
                        id: '10f1477d76ab4c6188e8f11c273da1c9'
                    }
                    'aiux-acl|experience:claudelearningportal|read|app-user': {
                        table: 'sys_security_acl'
                        id: '67c37c33183641e4a718f98d592b2d31'
                    }
                    'aiux-acl|x-ibmin-claudel-home-page|read|home-admin': {
                        table: 'sys_security_acl'
                        id: '49a8a64a3cd54ce3ab7ef40ead8e455a'
                    }
                    'aiux-acl|x-ibmin-claudel-home-page|read|home-experience-admin': {
                        table: 'sys_security_acl'
                        id: 'e4bb8a2f0cce44c9a3b8d9cc1dd044a5'
                    }
                    'aiux-acl|x-ibmin-claudel-home-page|read|home-user': {
                        table: 'sys_security_acl'
                        id: 'a15df1d3575f4899af65a27ba9ca9898'
                    }
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
                    'aiux-widget|aiux-claude-chat': {
                        table: 'sys_aix_widget'
                        id: 'c4de90a499da85f335116522bc0fd3db'
                        deleted: true
                    }
                    'aiux-widget|aiux-claude-status': {
                        table: 'sys_aix_widget'
                        id: 'c4206670dc6a52512be2b0b0653d3616'
                    }
                    'aiux-widget|aiux-hello-world': {
                        table: 'sys_aix_widget'
                        id: '0ee2ca2013c2b62f87576048ae7e2d5d'
                        deleted: true
                    }
                    'aiux-widget|aiux-otto-search': {
                        table: 'sys_aix_widget'
                        id: '62b0d8d34bec67078ec245285f7930c8'
                    }
                    bom_json: {
                        table: 'sys_module'
                        id: '0487ed2a5459482ca86aa1be55552636'
                    }
                    claude_api_key: {
                        table: 'sys_properties'
                        id: '3b1f0494fbf94e19b49482ebb27fa1e0'
                    }
                    claude_base_url: {
                        table: 'sys_properties'
                        id: '0b605777810c4f85af394653133bc543'
                    }
                    claude_max_tokens: {
                        table: 'sys_properties'
                        id: 'f9457db41aa048f6b4d239bb28c3cbb2'
                    }
                    claude_model: {
                        table: 'sys_properties'
                        id: '7f13f5ecb9dc4e358f533c1b8f34a85d'
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
                        table: 'sys_documentation'
                        id: '1f5cf3b308ef412a81177974cc4a2f67'
                        key: {
                            name: 'x_ibmin_claudel_search_log'
                            element: 'user'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '296551960a654146b3844c63952d23ad'
                        key: {
                            sys_security_acl: 'e4bb8a2f0cce44c9a3b8d9cc1dd044a5'
                            sys_user_role: {
                                id: '67b0d8a78f734035955f867466b0385d'
                                key: {
                                    name: 'aix_experience_admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '37d00a56ced74b5fa1f63033eb5ccecf'
                        key: {
                            sys_security_acl: '10f1477d76ab4c6188e8f11c273da1c9'
                            sys_user_role: {
                                id: '67b0d8a78f734035955f867466b0385d'
                                key: {
                                    name: 'aix_experience_admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '38e67484a5204ed7887cd3577ea7f1ad'
                        key: {
                            sys_security_acl: 'a15df1d3575f4899af65a27ba9ca9898'
                            sys_user_role: {
                                id: '6e168fa02e0c48378833f886ebd5de25'
                                key: {
                                    name: 'x_ibmin_claudel.user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sn_glider_source_artifact'
                        id: '4c66f33eefcf4d0d8e8eae6206effe67'
                        key: {
                            name: 'aiux-source cc1ba035956134867d46987f9abc40fe'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '505abbddb6e841e1bba57f4548834b73'
                        key: {
                            name: 'x_ibmin_claudel_search_log'
                            element: 'user'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '5333ac6784794fd09bf17e0b75b8b418'
                        key: {
                            sys_security_acl: 'aa9b6f0f76a44e959588a03a68ff0ce7'
                            sys_user_role: {
                                id: '6e168fa02e0c48378833f886ebd5de25'
                                key: {
                                    name: 'x_ibmin_claudel.user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '5b1cf7e6deba40e3ba65b185b7343fa4'
                        key: {
                            sys_security_acl: '31d50bcbd89f44b0ad0ad3f3e0d08dce'
                            sys_user_role: {
                                id: '67b0d8a78f734035955f867466b0385d'
                                key: {
                                    name: 'aix_experience_admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '5bbf062b591a40b7ba220080d57d6bf2'
                        key: {
                            sys_security_acl: 'c35d2faf8d2046f3945013964d2272d5'
                            sys_user_role: {
                                id: '67b0d8a78f734035955f867466b0385d'
                                key: {
                                    name: 'aix_experience_admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '7e88115cc57b4bc88d15c59acffd15a8'
                        key: {
                            name: 'x_ibmin_claudel_search_log'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: '861657909a3b4ba394e9c3ed14cf13cf'
                        key: {
                            name: 'x_ibmin_claudel_search_log'
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
                    {
                        table: 'sys_documentation'
                        id: 'bfb735386e7141e593c34fd3ac4b91cd'
                        key: {
                            name: 'x_ibmin_claudel_search_log'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: 'ce816fa0bf3549e8919acfad12d04abd'
                        key: {
                            name: 'x_ibmin_claudel_search_log'
                        }
                    },
                    {
                        table: 'sys_user_role'
                        id: 'da35dcb86c1b46cbb94fb8f1f5e1f255'
                        key: {
                            name: 'x_ibmin_claudel.user'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'e0084227a74d475bac46044e6e695187'
                        key: {
                            sys_security_acl: '67c37c33183641e4a718f98d592b2d31'
                            sys_user_role: {
                                id: '6e168fa02e0c48378833f886ebd5de25'
                                key: {
                                    name: 'x_ibmin_claudel.user'
                                }
                            }
                        }
                    },
                ]
            }
        }
    }
}
