import axios from 'axios';

export declare module Bilibili_Audio {

    export interface PlayUrlList {
        quality: string;
        url: string;
    }

    export interface Result {
        review_count: number;
        pubdate: number;
        title: string;
        cover: string;
        mid: number;
        play_count: number;
        putdate?: any;
        type: string;
        id: number;
        sq_url: string;
        high_url: string;
        mid_url: string;
        low_url: string;
        writer: string;
        play_url_list: PlayUrlList[];
        up_name: string;
        author: string;
        song_attr: number;
        limit: number;
        limitdesc: string;
        pgc_info?: any;
    }

    export interface Data {
        code: string;
        seid: string;
        page: number;
        pagesize: number;
        msg: string;
        result: Result[];
        easy?: any;
        num_pages: number;
    }

    export interface RootObject {
        code: number;
        msg: string;
        data: Data;
    }

}


/**
 * 搜索音乐
 * @param keyword   关键词
 * @param page      页码
 * @param page_size 每页返回数量
 */
export const search_audio = async (keyword = '泠鸢 yousa', page = 1, page_size = 20) => {
    return axios.get<Bilibili_Audio.RootObject>(`https://api.bilibili.com/audio/music-service-c/s`, {
        params: {
            page,
            pagesize: page_size,
            search_type: 'music',
            keyword
        }
    })
}
