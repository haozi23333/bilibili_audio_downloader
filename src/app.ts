import {Bilibili_Audio, search_audio} from "./api";
const fs = require('fs')
const request = require('request');
const progress = require('request-progress');
import ora from 'ora'


let spinner = ora('欢迎使用 ~').start();

/**
 * 获取音频列表
 * @param keyword       关键词
 * @param max_page      最大搜索页码
 * @param page          当前页码
 * @param audio_list    搜索数组
 */
async function get_audio_list(keyword,  max_page = 10, page = 1, audio_list = []): Promise<Bilibili_Audio.Result[]> {
   spinner.text = `正在🔍关键词 ${keyword}, 第 ${page} 总 ${max_page}页, 已找到 ${audio_list.length} 条`
   const { data } = await search_audio(keyword, page);
   if (data.code === 0) {
      data.data.result.map((audio) => {
         if (audio.author === '泠鸢yousa') {
            audio_list.push(audio)
         }
      })
   }

   if (data.data.num_pages === page || page === max_page) {
      return audio_list;
   }

   return get_audio_list(keyword, max_page, page + 1, audio_list)
}

/**
 * 下载音乐
 * @param url           地址
 * @param file_name     文件名
 */
async function download_audio(url, file_name) {
   return new Promise((s, j) => {
      let size = 0;
      progress(request(url)).on('progress', (p) => {
         size = Math.round(p.size.total / 1024 / 1024)
         spinner.text = `${file_name}: ${ size }MB, (${Math.round(p.size.transferred / p.size.total)} %)`
      }).on('end', function (p) {
         spinner.succeed(`${file_name}: ${ size }MB 下载完成`)
         spinner.stop();
         s()
      }).pipe(fs.createWriteStream(`./songs/${file_name}`))
   })
}

(async () => {
   const keyword = '泠鸢yousa'
   spinner.text = `正在🔍关键词 ${keyword}`
   const array = await get_audio_list(keyword, 2);
   spinner.succeed(`🔍 搜索完成, 共找到 ${array.length} 条歌曲, 开始下载`)
   spinner.stop();
   await Promise.all(array.map(async (audio) => {
      // 这里挑选最好的音质
      const data = audio.play_url_list.sort((a, b) => parseInt(a.quality) > parseInt(b.quality) ? 0 : 1).shift();
      await download_audio(data.url, `${audio.title}_${data.quality}.flac`)
   }))
})()
