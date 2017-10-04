<?php
$root_dir='F:\\git-repo\\thought';
$method =$_SERVER['REQUEST_METHOD'];
$url_str=parse_url($_SERVER["REQUEST_URI"]);
function convertUrlQuery($query)
{
  $queryParts = explode('&', $query);
  $params = array();
  foreach ($queryParts as $param) {
    $item = explode('=', $param);
    $params[$item[0]] = $item[1];
  }
  return $params;
}

function get_basename($filename){  
     return preg_replace('/^.+[\\\\\\/]/', '', $filename);  
}

function read_all_dir($dir, $fname)
{
    $result = '';
    $handle = opendir($dir);
    if ($handle) {
        while (($file = readdir($handle)) !== false) {            
            if ($file != '.' && $file != '..') {
                $file = iconv("gb2312", "utf-8", $file);                 
                $cur_path = $dir . DIRECTORY_SEPARATOR . $file;
                // TODO: 文件名中有副本 - xx.km不能匹配
                if (get_basename($file)==$fname) {
                    //echo "\nmatch " . $fname . " " . $cur_path . "\n";
                    $result = $cur_path;
                    break;
                }
                if (is_dir($cur_path)) {                    
                    $result = read_all_dir($cur_path, $fname);
                    if ($result != '') {                        
                        break;
                    }
                }
            }
        }
        closedir($handle);
    }
    return $result;
}

$arr_query = convertUrlQuery($url_str['query']);
$fname=urldecode($arr_query['fname']);
$title=urldecode($arr_query['text']);

if ($fname=='') {
    print('empty fname');
    exit(0);
}
$target=read_all_dir($root_dir, $fname);
if ($target == '') {
    echo 'not found ' . $fname;
    exit(0);
} else {
    //echo $all_file[0] . " " . " find\n";
    //echo 'find ' . $target . '\n';
}
//print_r($all_file);
//var_dump($arr_query);
//$query_str=convertUrlQuery($url_str['query']);
//var_dump($query_str);
//print_r($arr_query);

$url=file_get_contents("php://input");
$ans=json_decode($url);
//echo $ans;
//$arr=parse_url($url);
//print_r(parse_url($url));
//echo parse_url($url, PHP_URL_PATH);
//$ans=$arr['path'];
//echo $ans
//$content = file_get_contents($url);
//echo $content;
$target = iconv("utf-8", "gb2312", $target);
$myfile = fopen($target, "wb");
fwrite($myfile, $ans);
fclose($myfile);
echo "OK";
?>